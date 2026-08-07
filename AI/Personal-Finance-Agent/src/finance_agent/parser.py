from __future__ import annotations

import hashlib
import re
import unicodedata
from datetime import datetime

from .models import EmailRecord, Transaction


AMOUNT_RE = re.compile(
    r"(?P<prefix>[+\-])?\s*(?P<number>\d{1,3}(?:[.,]\d{3})+|\d+)(?:\s*(?P<currency>VND|VNĐ|đ|d))?",
    re.IGNORECASE,
)

BALANCE_RE = re.compile(
    r"(?:so du|balance)[^\d]{0,40}(?P<number>\d{1,3}(?:[.,]\d{3})+|\d+)",
    re.IGNORECASE,
)

ACCOUNT_RE = re.compile(
    r"(?:TK|account|acct|card|the|thẻ)[^\d]{0,10}(?P<hint>\*{2,}\d{2,6}|\d{2,6})",
    re.IGNORECASE,
)

CONTENT_PATTERNS = [
    re.compile(r"(?:noi dung|nội dung|content|remark|description)[:\s-]+(?P<value>.+)", re.IGNORECASE),
    re.compile(r"(?:tai|tại|merchant)[:\s-]+(?P<value>.+)", re.IGNORECASE),
]

SENDER_PATTERNS = [
    re.compile(r"(?:nguoi gui|người gửi|from)[:\s-]+(?P<value>.+)", re.IGNORECASE),
]

RECEIVER_PATTERNS = [
    re.compile(r"(?:nguoi nhan|người nhận|to|ben thu huong|bên thụ hưởng)[:\s-]+(?P<value>.+)", re.IGNORECASE),
]

FIELD_STOP_LABELS = [
    "Ngày, giờ giao dịch",
    "Loại giao dịch",
    "Số tham chiếu",
    "Tài khoản trích nợ",
    "Tài khoản ghi có",
    "Người thụ hưởng",
    "Số tiền giao dịch",
    "Nội dung chuyển tiền",
    "Cách thức lệnh",
    "Ngày nhập lệnh",
    "Thời gian",
    "Tình trạng",
]

DATETIME_PATTERNS = [
    re.compile(r"Ngày, giờ giao dịch\s+(?P<value>\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2})", re.IGNORECASE),
    re.compile(r"(?P<value>\d{2}[/-]\d{2}[/-]\d{4}\s+\d{2}:\d{2}:\d{2})", re.IGNORECASE),
]

EXPENSE_WORDS = {
    "debit",
    "ghi no",
    "ghi nợ",
    "tru",
    "trừ",
    "thanh toan",
    "thanh toán",
    "purchase",
    "payment",
    "rut tien",
    "rút tiền",
    "chi tieu",
    "chi tiêu",
}

INCOME_WORDS = {
    "credit",
    "ghi co",
    "ghi có",
    "cong",
    "cộng",
    "nhan",
    "nhận",
    "incoming",
    "salary",
    "luong",
    "lương",
}

AMOUNT_CONTEXT = {
    "so tien",
    "số tiền",
    "amount",
    "giao dich",
    "giao dịch",
    "thanh toan",
    "thanh toán",
    "chuyen khoan",
    "chuyển khoản",
    "debit",
    "credit",
    "vnd",
    "vnđ",
}

FINANCIAL_SENDERS = {
    "vietcombank",
    "vcb",
    "techcombank",
    "tcb",
    "mbbank",
    "mb bank",
    "bidv",
    "vpbank",
    "tpbank",
    "acb",
    "vib",
    "sacombank",
    "msb",
    "ocb",
    "hdbank",
    "shinhan",
    "hsbc",
    "uob",
    "citibank",
    "momo",
    "zalopay",
    "vnpay",
    "paypal",
}

FINANCIAL_NOTICE_WORDS = {
    "bien dong",
    "giao dich",
    "so tien",
    "so du",
    "thanh toan",
    "chuyen khoan",
    "ghi no",
    "ghi co",
    "debit",
    "credit",
    "transaction",
    "payment",
}

MAX_PERSONAL_VND_AMOUNT = 1_000_000_000


def parse_transaction(record: EmailRecord) -> Transaction | None:
    text = f"{record.subject}\n{record.body}"
    if not _looks_like_financial_notice(record, text):
        return None

    amount = _extract_amount(text)
    if amount is None:
        return None

    transaction_type = _detect_type(text, amount)
    normalized_amount = abs(amount)
    bank = _detect_bank(record.sender, record.subject)
    content = _extract_labeled_field(text, ["Nội dung chuyển tiền", "Nội dung", "Remark", "Description"])
    if not content:
        content = _first_match(text, CONTENT_PATTERNS) or _best_content_line(record.body)
    sender = _extract_labeled_field(text, ["Tài khoản trích nợ", "Người gửi"]) or _first_match(text, SENDER_PATTERNS)
    receiver = _extract_labeled_field(text, ["Người thụ hưởng", "Người nhận"]) or _first_match(text, RECEIVER_PATTERNS)
    account_hint = _extract_account_hint(text)
    balance_after = _extract_balance(text)
    occurred_at = _extract_occurred_at(text) or record.received_at or datetime.now()

    digest = hashlib.sha256(
        f"{record.email_id}:{normalized_amount}:{transaction_type}:{content}:{occurred_at}".encode("utf-8")
    ).hexdigest()

    return Transaction(
        transaction_id=digest[:24],
        email_id=record.email_id,
        source="email",
        bank=bank,
        occurred_at=occurred_at,
        transaction_type=transaction_type,
        amount=normalized_amount,
        currency="VND",
        content=_trim_field(content),
        sender=_trim_field(_mask_sensitive(sender)),
        receiver=_trim_field(_mask_sensitive(receiver)),
        account_hint=account_hint,
        balance_after=balance_after,
        category="Uncategorized",
        raw_subject=record.subject,
        raw_from=record.sender,
        raw_snippet=_trim_field(_mask_sensitive(record.body.replace("\n", " ")), 500),
    )


def _extract_amount(text: str) -> float | None:
    scored: list[tuple[int, float]] = []
    for line in text.splitlines():
        lowered = _normalize_text(line)
        if _looks_like_url_or_tracking_line(lowered):
            continue

        for match in AMOUNT_RE.finditer(line):
            if _number_is_embedded(line, match):
                continue

            number = _parse_number(match.group("number"))
            if number is None or number < 1_000 or number > MAX_PERSONAL_VND_AMOUNT:
                continue

            has_currency = bool(match.group("currency")) or "vnd" in lowered or "vnd" in _normalize_text(line)
            has_amount_context = any(word in lowered for word in _normalized_words(AMOUNT_CONTEXT))
            if not has_currency and not has_amount_context:
                continue

            score = 0
            if has_currency:
                score += 2
            if has_amount_context:
                score += 3
            if any(word in lowered for word in _normalized_words(EXPENSE_WORDS | INCOME_WORDS)):
                score += 2
            if "so du" in lowered or "balance" in lowered:
                score -= 4
            if match.group("prefix") == "-":
                number = -number
            scored.append((score, number))

    if not scored:
        return None
    scored.sort(key=lambda item: (item[0], abs(item[1])), reverse=True)
    return scored[0][1]


def _extract_balance(text: str) -> float | None:
    match = BALANCE_RE.search(_normalize_text(text))
    if not match:
        return None
    return _parse_number(match.group("number"))


def _extract_account_hint(text: str) -> str:
    match = ACCOUNT_RE.search(text)
    return _mask_sensitive(match.group("hint")) if match else ""


def _extract_occurred_at(text: str) -> datetime | None:
    for pattern in DATETIME_PATTERNS:
        match = pattern.search(text)
        if not match:
            continue
        value = match.group("value").replace("/", "-")
        try:
            return datetime.strptime(value, "%d-%m-%Y %H:%M:%S")
        except ValueError:
            continue
    return None


def _detect_type(text: str, amount: float) -> str:
    lowered = _normalize_text(text)
    if amount < 0:
        return "expense"
    if any(word in lowered for word in _normalized_words(EXPENSE_WORDS)):
        return "expense"
    if any(word in lowered for word in _normalized_words(INCOME_WORDS)):
        return "income"
    return "expense"


def _detect_bank(sender: str, subject: str) -> str:
    haystack = _normalize_text(f"{sender} {subject}")
    banks = {
        "vietcombank": "Vietcombank",
        "vcb": "Vietcombank",
        "techcombank": "Techcombank",
        "tcb": "Techcombank",
        "mbbank": "MB Bank",
        "mb bank": "MB Bank",
        "vpbank": "VPBank",
        "acb": "ACB",
        "tpbank": "TPBank",
        "bidv": "BIDV",
        "vib": "VIB",
        "momo": "MoMo",
        "zalopay": "ZaloPay",
    }
    for keyword, bank in banks.items():
        if keyword in haystack:
            return bank
    return "Unknown"


def _first_match(text: str, patterns: list[re.Pattern[str]]) -> str:
    for pattern in patterns:
        match = pattern.search(text)
        if match:
            return match.group("value")
    return ""


def _extract_labeled_field(text: str, labels: list[str]) -> str:
    collapsed = re.sub(r"\s+", " ", text).strip()
    stops = [re.escape(label) for label in FIELD_STOP_LABELS]
    stop_pattern = "|".join(stops)
    for label in labels:
        pattern = re.compile(
            rf"{re.escape(label)}\s*(?P<value>.*?)(?=\s+(?:{stop_pattern})\b|$)",
            re.IGNORECASE,
        )
        match = pattern.search(collapsed)
        if match:
            value = match.group("value").strip(" :-")
            if value:
                return value
    return ""


def _best_content_line(body: str) -> str:
    for line in body.splitlines():
        lowered = _normalize_text(line)
        if any(word in lowered for word in ["noi dung", "thanh toan", "tai "]):
            return line
    return body.splitlines()[0] if body.splitlines() else ""


def _parse_number(value: str) -> float | None:
    cleaned = value.strip()
    if "," in cleaned and "." in cleaned:
        cleaned = cleaned.replace(".", "").replace(",", ".")
    else:
        cleaned = cleaned.replace(",", "").replace(".", "")
    try:
        return float(cleaned)
    except ValueError:
        return None


def _trim_field(value: str, limit: int = 160) -> str:
    value = re.sub(r"\s+", " ", value).strip()
    return value[:limit].rstrip()


def _mask_sensitive(value: str) -> str:
    return re.sub(r"\b\d{8,}\b", lambda match: "****" + match.group(0)[-4:], value)


def _looks_like_financial_notice(record: EmailRecord, text: str) -> bool:
    sender_subject = _normalize_text(f"{record.sender} {record.subject}")
    normalized = _normalize_text(text)
    sender_is_financial = any(keyword in sender_subject for keyword in FINANCIAL_SENDERS)
    has_notice_word = any(keyword in normalized for keyword in FINANCIAL_NOTICE_WORDS)
    has_currency = bool(re.search(r"\b(vnd|vnđ)\b|đ", text, re.IGNORECASE))
    return sender_is_financial and has_notice_word and has_currency


def _looks_like_url_or_tracking_line(line: str) -> bool:
    return "http://" in line or "https://" in line or "www." in line or "%3a" in line


def _number_is_embedded(line: str, match: re.Match[str]) -> bool:
    before = line[match.start() - 1] if match.start() > 0 else " "
    after = line[match.end()] if match.end() < len(line) else " "
    return before.isalnum() or after.isalnum()


def _normalize_text(value: str) -> str:
    value = value.lower().replace("đ", "d")
    normalized = unicodedata.normalize("NFD", value)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")


def _normalized_words(words: set[str]) -> set[str]:
    return {_normalize_text(word) for word in words}
