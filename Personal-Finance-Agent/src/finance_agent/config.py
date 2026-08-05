from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


def load_environment(env_path: str | Path = ".env") -> None:
    try:
        from dotenv import load_dotenv

        load_dotenv(env_path)
        return
    except ImportError:
        pass

    path = Path(env_path)
    if not path.exists():
        return

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"'))


def _bool_env(name: str, default: bool = False) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "y", "on"}


@dataclass(frozen=True)
class Settings:
    excel_path: Path
    notification_mode: str
    telegram_bot_token: str | None
    telegram_chat_id: str | None
    imap_host: str
    imap_port: int
    imap_user: str | None
    imap_password: str | None
    imap_folder: str
    imap_sender_filter: str | None
    imap_subject_filter: str | None
    imap_mark_seen: bool
    gmail_credentials_path: Path
    gmail_token_path: Path
    gmail_query: str
    drive_upload_enabled: bool
    drive_file_id_path: Path
    drive_file_name: str
    drive_folder_id: str | None

    @classmethod
    def from_env(cls) -> "Settings":
        load_environment()
        return cls(
            excel_path=Path(os.getenv("EXCEL_PATH", "data/finance.xlsx")),
            notification_mode=os.getenv("NOTIFICATION_MODE", "balanced").strip().lower(),
            telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN") or None,
            telegram_chat_id=os.getenv("TELEGRAM_CHAT_ID") or None,
            imap_host=os.getenv("IMAP_HOST", "imap.gmail.com"),
            imap_port=int(os.getenv("IMAP_PORT", "993")),
            imap_user=os.getenv("IMAP_USER") or None,
            imap_password=os.getenv("IMAP_PASSWORD") or None,
            imap_folder=os.getenv("IMAP_FOLDER", "INBOX"),
            imap_sender_filter=os.getenv("IMAP_SENDER_FILTER") or None,
            imap_subject_filter=os.getenv("IMAP_SUBJECT_FILTER") or None,
            imap_mark_seen=_bool_env("IMAP_MARK_SEEN", False),
            gmail_credentials_path=Path(os.getenv("GMAIL_CREDENTIALS_PATH", "config/google_credentials.json")),
            gmail_token_path=Path(os.getenv("GMAIL_TOKEN_PATH", "data/gmail_token.json")),
            gmail_query=os.getenv("GMAIL_QUERY", "newer_than:30d"),
            drive_upload_enabled=_bool_env("DRIVE_UPLOAD_ENABLED", False),
            drive_file_id_path=Path(os.getenv("DRIVE_FILE_ID_PATH", "data/drive_file_id.txt")),
            drive_file_name=os.getenv("DRIVE_FILE_NAME", "finance_dashboard.xlsx"),
            drive_folder_id=os.getenv("DRIVE_FOLDER_ID") or None,
        )
