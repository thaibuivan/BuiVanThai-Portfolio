# Apps Script deployment

Hướng này dùng Google Sheets + Apps Script để chạy tự động mỗi phút, không cần VM, Docker, Cloud Run hay billing Google Cloud.

## Chuẩn bị

1. Tạo một Google Sheet mới, ví dụ `Finance Agent`.
2. Vào `Extensions` -> `Apps Script`.
3. Xóa code mặc định trong `Code.gs`, copy toàn bộ nội dung từ `apps_script/Code.gs` vào.
4. Trong Apps Script, mở `Project Settings` -> bật `Show "appsscript.json" manifest file in editor`.
5. Mở file `appsscript.json`, thay bằng nội dung trong `apps_script/appsscript.json`.

## Lưu token Telegram an toàn

Không paste token vào sheet hoặc vào code.

Vào `Project Settings` -> `Script properties` -> `Add script property`:

- `TELEGRAM_BOT_TOKEN`: token bot Telegram mới của bạn.
- `TELEGRAM_CHAT_ID`: chat id cá nhân của bạn.
- `GMAIL_QUERY`: có thể bỏ trống, mặc định sẽ đọc email giao dịch gần 2 ngày.

## Chạy lần đầu

Trong Apps Script:

1. Chọn function `setupFinanceAgent`.
2. Bấm `Run`.
3. Google hỏi quyền thì chọn tài khoản Gmail nhận mail ngân hàng và cho phép.
4. Chọn function `testTelegram`, bấm `Run` để kiểm tra bot gửi được tin.
5. Chọn function `pollGmailNow`, bấm `Run` để đọc thử email.

Sau bước 1, trigger `pollFinanceAgent` sẽ tự chạy mỗi phút.

## Dashboard và report

Sau khi chạy `backfillCurrentMonth` hoặc khi trigger có dữ liệu mới, Apps Script tự cập nhật:

- `Dashboard`: KPI tháng hiện tại, chi tiêu theo category, top nơi nhận tiền, chi tiêu theo ngày, danh sách giao dịch cần phân loại.
- `Report`: bản tóm tắt chữ gồm tổng quan, điểm nổi bật, khoản vay/nợ, chất lượng dữ liệu và gợi ý hành động.
- `Monthly Summary`: số liệu tổng hợp theo tháng.
- `Debt Summary`: theo dõi bạn còn nợ ai hoặc ai còn nợ bạn.

Nếu vừa copy code mới và muốn tạo dashboard ngay từ dữ liệu đã có, chạy function:

```text
syncTelegramReviews
```

Function này sẽ đọc phản hồi Telegram nếu có và refresh lại toàn bộ report/dashboard.

## Logic khoản vay/trả nợ

Các category đặc biệt:

- `Vay nhận vào`: không tính là thu nhập.
- `Trả nợ gốc`: không tính là chi tiêu sinh hoạt.
- `Cho vay`: không tính là chi tiêu sinh hoạt.
- `Thu hồi cho vay`: không tính là thu nhập.
- `Chi phí tài chính`: chỉ dùng cho lãi/phí vay, có tính vào chi tiêu.

Nếu một giao dịch trả cả gốc lẫn lãi, chọn `Trả nợ gốc`, sau đó điền phần lãi vào cột `interest_amount`. Monthly Summary sẽ tính phần lãi này vào chi tiêu, còn gốc thì loại ra.

## Keyword nên ghi trong nội dung chuyển khoản

Chi tiêu:

```text
anuong, sieuthi, muasam, dichuyen, giadinh, nhatro, hocphi, suckhoe, giaitri
```

Khoản vay/nợ:

```text
vay, trano, tragoc, chovay, thuhoino, laivay
```

Thu nhập thật:

```text
luong, salary, thu nhap, thuong
```

Loại khỏi dashboard chi tiêu:

```text
noibo, tietkiem, dautu
```

Nếu quên keyword, Telegram sẽ hỏi bạn chọn category.
