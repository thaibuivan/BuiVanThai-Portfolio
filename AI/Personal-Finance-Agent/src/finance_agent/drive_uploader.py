from __future__ import annotations

from pathlib import Path

from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

from .config import Settings
from .gmail_loader import build_google_credentials


EXCEL_MIME_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def upload_excel_to_drive(settings: Settings, excel_path: str | Path) -> str:
    path = Path(excel_path)
    if not path.exists():
        raise FileNotFoundError(f"Excel file not found: {path}")

    creds = build_google_credentials(settings.gmail_credentials_path, settings.gmail_token_path)
    service = build("drive", "v3", credentials=creds)

    file_id = _read_file_id(settings.drive_file_id_path)
    media = MediaFileUpload(str(path), mimetype=EXCEL_MIME_TYPE, resumable=False)

    if file_id:
        result = (
            service.files()
            .update(
                fileId=file_id,
                media_body=media,
                fields="id, webViewLink",
            )
            .execute()
        )
        return result["id"]

    metadata: dict[str, object] = {
        "name": settings.drive_file_name,
        "mimeType": EXCEL_MIME_TYPE,
    }
    if settings.drive_folder_id:
        metadata["parents"] = [settings.drive_folder_id]

    result = (
        service.files()
        .create(
            body=metadata,
            media_body=media,
            fields="id, webViewLink",
        )
        .execute()
    )
    settings.drive_file_id_path.parent.mkdir(parents=True, exist_ok=True)
    settings.drive_file_id_path.write_text(result["id"], encoding="utf-8")
    return result["id"]


def _read_file_id(path: Path) -> str | None:
    if not path.exists():
        return None
    value = path.read_text(encoding="utf-8").strip()
    return value or None
