from __future__ import annotations

import email
import hashlib
import html
import imaplib
import re
from datetime import datetime
from email.header import decode_header
from email.message import Message
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Iterable

from .config import Settings
from .models import EmailRecord


def iter_eml_files(path: str | Path) -> Iterable[EmailRecord]:
    base = Path(path)
    if not base.exists():
        return

    files = [base] if base.is_file() else sorted(base.rglob("*.eml"))
    for file_path in files:
        raw = file_path.read_bytes()
        msg = email.message_from_bytes(raw)
        yield message_to_record(msg, fallback_id=file_path.as_posix())


def fetch_unseen_imap(settings: Settings, limit: int = 20) -> list[EmailRecord]:
    if not settings.imap_user or not settings.imap_password:
        raise ValueError("IMAP_USER and IMAP_PASSWORD are required for IMAP polling.")

    records: list[EmailRecord] = []
    with imaplib.IMAP4_SSL(settings.imap_host, settings.imap_port) as client:
        client.login(settings.imap_user, settings.imap_password)
        client.select(settings.imap_folder)

        status, search_data = client.search(None, "UNSEEN")
        if status != "OK":
            raise RuntimeError(f"IMAP search failed: {status}")

        message_ids = search_data[0].split()[-limit:]
        fetch_part = "(RFC822)" if settings.imap_mark_seen else "(BODY.PEEK[])"

        for msg_id in message_ids:
            status, fetch_data = client.fetch(msg_id, fetch_part)
            if status != "OK":
                continue
            for part in fetch_data:
                if not isinstance(part, tuple):
                    continue
                msg = email.message_from_bytes(part[1])
                record = message_to_record(msg, fallback_id=msg_id.decode("ascii", "ignore"))
                if _matches_filters(record, settings):
                    records.append(record)

    return records


def _matches_filters(record: EmailRecord, settings: Settings) -> bool:
    sender_filter = (settings.imap_sender_filter or "").strip().lower()
    subject_filter = (settings.imap_subject_filter or "").strip().lower()
    if sender_filter and sender_filter not in record.sender.lower():
        return False
    if subject_filter and subject_filter not in record.subject.lower():
        return False
    return True


def message_to_record(msg: Message, fallback_id: str) -> EmailRecord:
    subject = _decode_mime_header(msg.get("Subject", ""))
    sender = _decode_mime_header(msg.get("From", ""))
    raw_message_id = msg.get("Message-ID") or fallback_id
    received_at = _parse_date(msg.get("Date"))
    body = _extract_body(msg)
    email_id = hashlib.sha256(f"{raw_message_id}:{subject}:{body[:500]}".encode("utf-8")).hexdigest()
    return EmailRecord(
        email_id=email_id,
        subject=subject,
        sender=sender,
        received_at=received_at,
        body=body,
    )


def _decode_mime_header(value: str) -> str:
    parts = decode_header(value)
    decoded: list[str] = []
    for content, encoding in parts:
        if isinstance(content, bytes):
            try:
                decoded.append(content.decode(encoding or "utf-8", errors="replace"))
            except LookupError:
                decoded.append(content.decode("utf-8", errors="replace"))
        else:
            decoded.append(content)
    return "".join(decoded).strip()


def _parse_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = parsedate_to_datetime(value)
        return parsed.replace(tzinfo=None)
    except (TypeError, ValueError, IndexError):
        return None


def _extract_body(msg: Message) -> str:
    if msg.is_multipart():
        plain_parts: list[str] = []
        html_parts: list[str] = []
        for part in msg.walk():
            if part.get_content_disposition() == "attachment":
                continue
            content_type = part.get_content_type()
            if content_type not in {"text/plain", "text/html"}:
                continue
            text = _payload_to_text(part)
            if content_type == "text/plain":
                plain_parts.append(text)
            else:
                html_parts.append(_html_to_text(text))
        return _clean_body("\n".join(plain_parts or html_parts))

    content = _payload_to_text(msg)
    if msg.get_content_type() == "text/html":
        content = _html_to_text(content)
    return _clean_body(content)


def _payload_to_text(part: Message) -> str:
    payload = part.get_payload(decode=True)
    if payload is None:
        text = part.get_payload()
        return text if isinstance(text, str) else ""
    charset = part.get_content_charset() or "utf-8"
    return payload.decode(charset, errors="replace")


def _html_to_text(value: str) -> str:
    value = re.sub(r"(?is)<(script|style).*?</\1>", " ", value)
    value = re.sub(r"(?i)<br\s*/?>", "\n", value)
    value = re.sub(r"(?i)</p\s*>", "\n", value)
    value = re.sub(r"(?s)<[^>]+>", " ", value)
    return html.unescape(value)


def _clean_body(value: str) -> str:
    value = value.replace("\xa0", " ")
    lines = [re.sub(r"\s+", " ", line).strip() for line in value.splitlines()]
    return "\n".join(line for line in lines if line)
