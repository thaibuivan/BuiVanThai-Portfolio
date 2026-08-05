from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

from .categorizer import categorize
from .config import Settings
from .drive_uploader import upload_excel_to_drive
from .email_loader import fetch_unseen_imap, iter_eml_files
from .excel_store import ExcelStore
from .gmail_loader import fetch_gmail_messages
from .insights import build_context
from .models import EmailRecord, Transaction
from .notifier import (
    answer_callback_query,
    category_choice,
    format_transaction_message,
    get_telegram_updates,
    get_telegram_bot_info,
    parse_category_callback,
    send_telegram_message,
    send_telegram_review_message,
)
from .parser import parse_transaction


def main(argv: list[str] | None = None) -> int:
    settings = Settings.from_env()
    parser = argparse.ArgumentParser(description="Personal finance agent from bank email to Excel and Telegram.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    ingest = subparsers.add_parser("ingest-eml", help="Parse .eml files from a folder or single file.")
    ingest.add_argument("path", type=Path)
    ingest.add_argument("--excel", type=Path, default=settings.excel_path)
    ingest.add_argument("--notify", action="store_true")

    poll = subparsers.add_parser("poll-imap", help="Fetch unseen emails over IMAP.")
    poll.add_argument("--excel", type=Path, default=settings.excel_path)
    poll.add_argument("--limit", type=int, default=20)
    poll.add_argument("--notify", action="store_true")

    gmail = subparsers.add_parser("poll-gmail", help="Fetch emails through Gmail API OAuth.")
    gmail.add_argument("--excel", type=Path, default=settings.excel_path)
    gmail.add_argument("--limit", type=int, default=20)
    gmail.add_argument("--query", default=None, help="Gmail search query, e.g. newer_than:7d from:bank")
    gmail.add_argument("--notify", action="store_true")

    watch = subparsers.add_parser("watch-gmail", help="Continuously poll Gmail and notify Telegram.")
    watch.add_argument("--excel", type=Path, default=settings.excel_path)
    watch.add_argument("--limit", type=int, default=100)
    watch.add_argument("--query", default="newer_than:2d", help="Gmail query for each polling cycle.")
    watch.add_argument("--interval", type=int, default=60, help="Polling interval in seconds.")
    watch.add_argument("--offset-file", type=Path, default=Path("data/telegram_offset.txt"))
    watch.add_argument("--no-sync-reviews", action="store_true", help="Do not read Telegram category button replies.")

    test_notify = subparsers.add_parser("test-notify", help="Send a safe Telegram test message.")
    test_notify.add_argument("--text", default="Finance agent test: notification channel is ready.")

    setup_telegram = subparsers.add_parser("setup-telegram-chat", help="Find Telegram chat_id and update .env.")
    setup_telegram.add_argument("--env-file", type=Path, default=Path(".env"))

    bot_info = subparsers.add_parser("telegram-bot-info", help="Show the bot username for the configured token.")

    sync_reviews = subparsers.add_parser("sync-telegram-reviews", help="Apply Telegram category button replies.")
    sync_reviews.add_argument("--excel", type=Path, default=settings.excel_path)
    sync_reviews.add_argument("--offset-file", type=Path, default=Path("data/telegram_offset.txt"))

    upload_drive = subparsers.add_parser("upload-drive", help="Upload the current Excel workbook to Google Drive.")
    upload_drive.add_argument("--excel", type=Path, default=settings.excel_path)

    args = parser.parse_args(argv)

    if args.command == "test-notify":
        _send_test_notification(settings, args.text)
        return 0

    if args.command == "setup-telegram-chat":
        return _setup_telegram_chat(args.env_file, settings)

    if args.command == "telegram-bot-info":
        return _telegram_bot_info(settings)

    if args.command == "sync-telegram-reviews":
        return _sync_telegram_reviews(args.excel, args.offset_file, settings)

    if args.command == "upload-drive":
        file_id = upload_excel_to_drive(settings, args.excel)
        print(f"Uploaded to Google Drive file id: {file_id}")
        return 0

    if args.command == "ingest-eml":
        records = list(iter_eml_files(args.path))
        return _process_records(records, args.excel, args.notify, settings)

    if args.command == "poll-imap":
        records = fetch_unseen_imap(settings, args.limit)
        return _process_records(records, args.excel, args.notify, settings)

    if args.command == "poll-gmail":
        records = fetch_gmail_messages(settings, args.limit, args.query)
        return _process_records(records, args.excel, args.notify, settings)

    if args.command == "watch-gmail":
        return _watch_gmail(
            excel_path=args.excel,
            limit=args.limit,
            query=args.query,
            interval_seconds=args.interval,
            offset_file=args.offset_file,
            sync_reviews=not args.no_sync_reviews,
            settings=settings,
        )

    parser.print_help()
    return 1


def _process_records(records: list[EmailRecord], excel_path: Path, notify: bool, settings: Settings) -> int:
    transactions = _parse_records(records)
    store = ExcelStore(excel_path)
    inserted = store.append_transactions(transactions)

    print(f"Emails read: {len(records)}")
    print(f"Transactions parsed: {len(transactions)}")
    print(f"New transactions inserted: {len(inserted)}")
    print(f"Excel: {store.path}")

    if notify and inserted:
        _notify_transactions(inserted, store, settings)
    elif notify:
        print("No new transactions to notify.")

    if inserted and settings.drive_upload_enabled:
        file_id = upload_excel_to_drive(settings, store.path)
        print(f"Google Drive uploaded: {file_id}")

    return 0


def _parse_records(records: list[EmailRecord]) -> list[Transaction]:
    transactions: list[Transaction] = []
    for record in records:
        transaction = parse_transaction(record)
        if transaction is None:
            continue
        transactions.append(categorize(transaction))
    return transactions


def _notify_transactions(transactions: list[Transaction], store: ExcelStore, settings: Settings) -> None:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        raise ValueError("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required when --notify is used.")

    all_transactions = store.load_transactions()
    for transaction in transactions:
        context = build_context(transaction, all_transactions)
        if transaction.needs_review:
            send_telegram_review_message(settings.telegram_bot_token, settings.telegram_chat_id, transaction)
        else:
            message = format_transaction_message(transaction, context, settings.notification_mode)
            send_telegram_message(settings.telegram_bot_token, settings.telegram_chat_id, message)
        print(f"Telegram notified: {transaction.transaction_id}")


def _send_test_notification(settings: Settings, text: str) -> None:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        raise ValueError("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required.")
    send_telegram_message(settings.telegram_bot_token, settings.telegram_chat_id, text)
    print("Telegram test message sent.")


def _setup_telegram_chat(env_file: Path, settings: Settings) -> int:
    if not settings.telegram_bot_token:
        raise ValueError("TELEGRAM_BOT_TOKEN is missing. Put your bot token in .env first.")

    updates = get_telegram_updates(settings.telegram_bot_token)
    chat_id = None
    for update in reversed(updates):
        message = update.get("message") or update.get("edited_message")
        if not message:
            continue
        chat = message.get("chat") or {}
        if chat.get("type") == "private" and chat.get("id") is not None:
            chat_id = str(chat["id"])
            break

    if not chat_id:
        raise ValueError("No private chat found. Open your bot in Telegram and send /start, then run again.")

    _upsert_env_value(env_file, "TELEGRAM_CHAT_ID", chat_id)
    print("Telegram chat id saved to .env.")
    print(f"TELEGRAM_CHAT_ID={chat_id}")
    return 0


def _telegram_bot_info(settings: Settings) -> int:
    if not settings.telegram_bot_token:
        raise ValueError("TELEGRAM_BOT_TOKEN is missing.")
    info = get_telegram_bot_info(settings.telegram_bot_token)
    print(f"Bot username: @{info.get('username')}")
    print(f"Bot name: {info.get('first_name')}")
    return 0


def _upsert_env_value(env_file: Path, key: str, value: str) -> None:
    lines = env_file.read_text(encoding="utf-8").splitlines() if env_file.exists() else []
    updated = False
    next_lines = []
    for line in lines:
        if line.startswith(f"{key}="):
            next_lines.append(f"{key}={value}")
            updated = True
        else:
            next_lines.append(line)
    if not updated:
        next_lines.append(f"{key}={value}")
    env_file.write_text("\n".join(next_lines) + "\n", encoding="utf-8")


def _sync_telegram_reviews(excel_path: Path, offset_file: Path, settings: Settings) -> int:
    if not settings.telegram_bot_token:
        raise ValueError("TELEGRAM_BOT_TOKEN is required.")

    offset = _read_offset(offset_file)
    updates = get_telegram_updates(settings.telegram_bot_token, offset)
    store = ExcelStore(excel_path)
    applied = 0
    latest_update_id = offset - 1 if offset is not None else None

    for update in updates:
        latest_update_id = max(latest_update_id or update["update_id"], update["update_id"])
        callback = update.get("callback_query")
        if not callback:
            continue
        parsed = parse_category_callback(callback.get("data", ""))
        if not parsed:
            continue
        transaction_id, category_key = parsed
        category, include_in_spending = category_choice(category_key)
        updated = store.update_transaction_category(
            transaction_id,
            category,
            include_in_spending,
            category_source=f"telegram_button:{category_key}",
        )
        if updated:
            applied += 1
            answer_callback_query(settings.telegram_bot_token, callback["id"], f"Đã lưu: {category}")
        else:
            answer_callback_query(settings.telegram_bot_token, callback["id"], "Không tìm thấy giao dịch trong Excel")

    if latest_update_id is not None:
        offset_file.parent.mkdir(parents=True, exist_ok=True)
        offset_file.write_text(str(latest_update_id + 1), encoding="utf-8")

    if applied and settings.drive_upload_enabled:
        file_id = upload_excel_to_drive(settings, excel_path)
        print(f"Google Drive uploaded: {file_id}")

    print(f"Telegram updates read: {len(updates)}")
    print(f"Review choices applied: {applied}")
    print(f"Excel: {excel_path}")
    return 0


def _watch_gmail(
    excel_path: Path,
    limit: int,
    query: str,
    interval_seconds: int,
    offset_file: Path,
    sync_reviews: bool,
    settings: Settings,
) -> int:
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        raise ValueError("TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are required for realtime watch mode.")
    if interval_seconds < 15:
        raise ValueError("--interval should be at least 15 seconds to avoid excessive API calls.")

    print("Realtime watch started.")
    print(f"Gmail query: {query}")
    print(f"Limit per cycle: {limit}")
    print(f"Interval: {interval_seconds}s")
    print(f"Excel: {excel_path}")
    print("Press Ctrl+C to stop.")

    while True:
        started_at = time.strftime("%Y-%m-%d %H:%M:%S")
        try:
            print(f"\n[{started_at}] Checking Gmail...")
            records = fetch_gmail_messages(settings, limit, query)
            _process_records(records, excel_path, notify=True, settings=settings)
            if sync_reviews:
                _sync_telegram_reviews(excel_path, offset_file, settings)
        except KeyboardInterrupt:
            print("\nRealtime watch stopped.")
            return 0
        except Exception as exc:
            print(f"Watch cycle failed: {exc}")
        time.sleep(interval_seconds)


def _read_offset(offset_file: Path) -> int | None:
    if not offset_file.exists():
        return None
    try:
        return int(offset_file.read_text(encoding="utf-8").strip())
    except ValueError:
        return None


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
