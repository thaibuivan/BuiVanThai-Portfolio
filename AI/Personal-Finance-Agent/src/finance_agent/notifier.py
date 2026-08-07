from __future__ import annotations

import json
import re
import urllib.parse
import urllib.request

from .insights import MonthlyContext
from .models import Transaction


TELEGRAM_CATEGORY_CHOICES: dict[str, tuple[str, bool]] = {
    "anuong": ("Ăn uống", True),
    "sieuthi": ("Siêu thị", True),
    "muasam": ("Mua sắm", True),
    "dichuyen": ("Di chuyển", True),
    "giadinh": ("Gia đình", True),
    "nhatro": ("Nhà cửa", True),
    "hocphi": ("Học tập", True),
    "suckhoe": ("Sức khỏe", True),
    "giaitri": ("Giải trí", True),
    "trano": ("Trả nợ", True),
    "noibo": ("Chuyển khoản nội bộ", False),
    "tietkiem": ("Tiết kiệm", False),
    "dautu": ("Đầu tư", False),
    "khac": ("Khác", True),
    "skip": ("Không tính", False),
}


def format_transaction_message(transaction: Transaction, context: MonthlyContext | None, mode: str = "balanced") -> str:
    mode = mode.lower()
    if mode == "private":
        return _private_message(transaction, context)
    if mode == "detailed":
        return _detailed_message(transaction, context)
    return _balanced_message(transaction, context)


def send_telegram_message(bot_token: str, chat_id: str, text: str, reply_markup: dict | None = None) -> None:
    payload = {
        "chat_id": chat_id,
        "text": text,
        "disable_web_page_preview": True,
    }
    if reply_markup:
        payload["reply_markup"] = reply_markup
    _telegram_request(bot_token, "sendMessage", payload)


def send_telegram_review_message(bot_token: str, chat_id: str, transaction: Transaction) -> None:
    send_telegram_message(
        bot_token,
        chat_id,
        _review_message(transaction),
        reply_markup=_review_keyboard(transaction.transaction_id),
    )


def get_telegram_updates(bot_token: str, offset: int | None = None) -> list[dict]:
    payload: dict[str, object] = {
        "timeout": 0,
        "allowed_updates": ["message", "edited_message", "callback_query", "my_chat_member", "chat_member"],
    }
    if offset is not None:
        payload["offset"] = offset
    data = _telegram_request(bot_token, "getUpdates", payload)
    return data.get("result", [])


def get_telegram_bot_info(bot_token: str) -> dict:
    data = _telegram_request(bot_token, "getMe", {})
    return data.get("result", {})


def answer_callback_query(bot_token: str, callback_query_id: str, text: str) -> None:
    _telegram_request(bot_token, "answerCallbackQuery", {"callback_query_id": callback_query_id, "text": text})


def parse_category_callback(data: str) -> tuple[str, str] | None:
    parts = data.split("|", 2)
    if len(parts) != 3 or parts[0] != "cat":
        return None
    transaction_id, category_key = parts[1], parts[2]
    if category_key not in TELEGRAM_CATEGORY_CHOICES:
        return None
    return transaction_id, category_key


def category_choice(category_key: str) -> tuple[str, bool]:
    return TELEGRAM_CATEGORY_CHOICES[category_key]


def _telegram_request(bot_token: str, method: str, payload: dict) -> dict:
    url = f"https://api.telegram.org/bot{bot_token}/{method}"
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        body = response.read().decode("utf-8")
        data = json.loads(body)
        if not data.get("ok"):
            raise RuntimeError(f"Telegram API returned an error: {body}")
        return data


def _private_message(transaction: Transaction, context: MonthlyContext | None) -> str:
    lines = [
        "[Tài chính] Có giao dịch mới",
        f"Loại: {_vi_type(transaction.transaction_type)}",
        f"Danh mục: {transaction.category}",
    ]
    if context:
        lines.append(_budget_line(context, reveal_amount=False))
    lines.append("Chi tiết xem trong dashboard local.")
    return "\n".join(line for line in lines if line)


def _balanced_message(transaction: Transaction, context: MonthlyContext | None) -> str:
    if transaction.needs_review:
        return _review_message(transaction)

    lines = [
        f"[{_vi_type(transaction.transaction_type)}] {_approx_amount(transaction.amount)} - {transaction.category}",
    ]
    merchant = _safe_summary(transaction)
    if merchant:
        lines.append(f"Nội dung: {merchant}")
    if context:
        lines.append(_budget_line(context, reveal_amount=True))
    lines.append("Chi tiết đã lưu trong Excel local.")
    return "\n".join(line for line in lines if line)


def _detailed_message(transaction: Transaction, context: MonthlyContext | None) -> str:
    if transaction.needs_review:
        return _review_message(transaction)

    lines = [
        f"[{_vi_type(transaction.transaction_type)}] {_format_money(transaction.amount)} - {transaction.category}",
        f"Ngân hàng: {transaction.bank}",
    ]
    merchant = _safe_summary(transaction, limit=90)
    if merchant:
        lines.append(f"Nội dung: {merchant}")
    if context:
        lines.append(_budget_line(context, reveal_amount=True))
    lines.append("Không gửi số tài khoản đầy đủ hoặc raw email.")
    return "\n".join(line for line in lines if line)


def _review_message(transaction: Transaction) -> str:
    return "\n".join(
        [
            "[Cần phân loại] Giao dịch mới",
            f"Số tiền: {_approx_amount(transaction.amount)}",
            f"Người nhận: {_safe_summary(transaction, limit=80)}",
            f"Nội dung: {transaction.content or '(trống)'}",
            "Chọn category bên dưới. Lần sau nếu nhớ, hãy thêm keyword như anuong, sieuthi, noibo vào nội dung chuyển khoản.",
        ]
    )


def _review_keyboard(transaction_id: str) -> dict:
    rows: list[list[dict[str, str]]] = []
    items = list(TELEGRAM_CATEGORY_CHOICES.items())
    for index in range(0, len(items), 3):
        row = []
        for key, (label, _include) in items[index : index + 3]:
            row.append({"text": label, "callback_data": f"cat|{transaction_id}|{key}"})
        rows.append(row)
    return {"inline_keyboard": rows}


def _budget_line(context: MonthlyContext, reveal_amount: bool) -> str:
    if not context.category_budget:
        return f"Tổng chi tháng này: {_approx_amount(context.month_total_expense)}" if reveal_amount else ""
    ratio = context.category_total / context.category_budget if context.category_budget else 0
    percent = round(ratio * 100)
    if reveal_amount:
        return (
            f"Ngân sách danh mục: {_approx_amount(context.category_total)} / "
            f"{_approx_amount(context.category_budget)} ({percent}%)"
        )
    if percent >= 100:
        return "Danh mục này đã vượt ngân sách tháng."
    if percent >= 90:
        return "Danh mục này gần chạm ngân sách tháng."
    return "Ngân sách danh mục vẫn trong vùng ổn."


def _safe_summary(transaction: Transaction, limit: int = 50) -> str:
    value = transaction.receiver or transaction.content
    value = re.sub(r"\b\d{8,}\b", "[masked]", value)
    value = re.sub(r"\*{2,}\d{2,6}", "[account]", value)
    value = re.sub(r"\s+", " ", value).strip(" :-")
    return value[:limit].rstrip()


def _approx_amount(amount: float) -> str:
    step = 100_000 if amount >= 1_000_000 else 10_000
    rounded = round(amount / step) * step
    return f"~{_format_money(rounded)}"


def _format_money(amount: float) -> str:
    return f"{amount:,.0f} VND"


def _vi_type(transaction_type: str) -> str:
    return "Thu nhập" if transaction_type == "income" else "Chi tiêu"
