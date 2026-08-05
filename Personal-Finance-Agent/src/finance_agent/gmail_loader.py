from __future__ import annotations

import base64
import email
from pathlib import Path

from .config import Settings
from .email_loader import message_to_record
from .models import EmailRecord


SCOPES = [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/drive.file",
]


def fetch_gmail_messages(settings: Settings, limit: int = 20, query: str | None = None) -> list[EmailRecord]:
    service = _build_gmail_service(settings.gmail_credentials_path, settings.gmail_token_path)
    search_query = query if query is not None else settings.gmail_query

    response = (
        service.users()
        .messages()
        .list(userId="me", q=search_query, maxResults=limit)
        .execute()
    )
    messages = response.get("messages", [])

    records: list[EmailRecord] = []
    for item in messages:
        message_id = item["id"]
        raw_message = (
            service.users()
            .messages()
            .get(userId="me", id=message_id, format="raw")
            .execute()
        )
        raw_bytes = base64.urlsafe_b64decode(raw_message["raw"].encode("ascii"))
        msg = email.message_from_bytes(raw_bytes)
        records.append(message_to_record(msg, fallback_id=message_id))

    return records


def _build_gmail_service(credentials_path: Path, token_path: Path):
    creds = build_google_credentials(credentials_path, token_path)
    try:
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise RuntimeError(
            "Missing Gmail API dependencies. Run: pip install -r requirements.txt"
        ) from exc
    return build("gmail", "v1", credentials=creds)


def build_google_credentials(credentials_path: Path, token_path: Path):
    try:
        from google.auth.transport.requests import Request
        from google.oauth2.credentials import Credentials
        from google_auth_oauthlib.flow import InstalledAppFlow
    except ImportError as exc:
        raise RuntimeError(
            "Missing Gmail API dependencies. Run: pip install -r requirements.txt"
        ) from exc

    creds = None
    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not credentials_path.exists():
                raise FileNotFoundError(
                    f"Google OAuth credentials not found: {credentials_path}. "
                    "Download the Desktop app OAuth JSON from Google Cloud and put it there."
                )
            flow = InstalledAppFlow.from_client_secrets_file(str(credentials_path), SCOPES)
            creds = flow.run_local_server(port=0)

        token_path.parent.mkdir(parents=True, exist_ok=True)
        token_path.write_text(creds.to_json(), encoding="utf-8")

    return creds
