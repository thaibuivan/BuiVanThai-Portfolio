# Deploy 24/7

## Khuyến nghị hiện tại: Apps Script + Google Sheets

Nếu ưu tiên `free + dùng lâu dài + tránh phát sinh phí`, không dùng VPS/VM/Cloud Run trước.
Hãy dùng bản trong thư mục:

```text
apps_script/
```

Luồng mới:

```text
Gmail
-> Apps Script trigger mỗi 1 phút
-> Google Sheets
-> Telegram hỏi category khi thiếu keyword
-> Monthly Summary + Debt Summary tự cập nhật
```

Ưu điểm:

- Không cần billing Google Cloud.
- Không cần laptop bật 24/7.
- Không cần Docker/VPS.
- Phù hợp nhu cầu cá nhân.

Giới hạn:

- Không phải realtime từng giây; thực tế là gần realtime, khoảng 1 phút.
- Phụ thuộc quota Apps Script/Gmail/UrlFetch theo tài khoản Google.
- Nếu Gmail đổi format email ngân hàng, parser vẫn cần chỉnh thêm.

Xem hướng dẫn chi tiết trong `apps_script/README.md`.

---

Mục tiêu:

```text
Gmail API
→ cloud worker chạy 24/7
→ Telegram hỏi category
→ Excel được upload lên Google Drive
```

## Khuyến nghị kiến trúc

Nếu muốn đơn giản và ổn định nhất, dùng VPS/VM nhỏ chạy Docker container 24/7.

Nếu muốn dùng Google Cloud Run, cần cấu hình:

- `--min-instances=1` để service không scale về 0.
- `--no-cpu-throttling` để background polling vẫn chạy khi không có HTTP request.
- `DRIVE_UPLOAD_ENABLED=true` vì filesystem của container không bền.

## Cấp lại OAuth

Project hiện cần thêm quyền Drive:

```text
https://www.googleapis.com/auth/drive.file
```

Chạy local một lần:

```bat
del data\gmail_token.json
scripts\poll_gmail.bat
scripts\upload_drive.bat
```

Sau đó giữ lại các file secret:

```text
config/google_credentials.json
data/gmail_token.json
data/drive_file_id.txt
```

## Biến môi trường cloud

Dựa trên `cloud.env.example`:

```env
EXCEL_PATH=/tmp/finance_dashboard.xlsx
NOTIFICATION_MODE=balanced
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
GMAIL_CREDENTIALS_PATH=/secrets/google_credentials.json
GMAIL_TOKEN_PATH=/secrets/gmail_token.json
GMAIL_QUERY=newer_than:30d
DRIVE_UPLOAD_ENABLED=true
DRIVE_FILE_ID_PATH=/secrets/drive_file_id.txt
DRIVE_FILE_NAME=finance_dashboard.xlsx
DRIVE_FOLDER_ID=
```

## Docker local test

```bat
docker build -t finance-agent .
docker run --env-file cloud.env -v "%cd%\config:/secrets" -v "%cd%\data:/app/data" finance-agent
```

## Cloud Run outline

Build image:

```bat
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT_ID/finance-agent/app:latest
```

Deploy service:

```bat
gcloud run deploy finance-agent ^
  --image REGION-docker.pkg.dev/PROJECT_ID/finance-agent/app:latest ^
  --region REGION ^
  --min-instances=1 ^
  --no-cpu-throttling ^
  --memory=512Mi ^
  --cpu=1 ^
  --no-allow-unauthenticated ^
  --env-vars-file cloud.env.yaml
```

Với secrets, ưu tiên Secret Manager thay vì env file. Không paste token vào repo.
