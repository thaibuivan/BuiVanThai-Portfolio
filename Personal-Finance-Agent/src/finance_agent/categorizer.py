from __future__ import annotations

import unicodedata

from .models import Transaction


# The category should come from the transfer note/content, not from the receiver.
# One counterparty can receive money for many different reasons.
CONTENT_KEYWORD_CATEGORIES: dict[str, tuple[str, bool]] = {
    "anuong": ("Ăn uống", True),
    "an uong": ("Ăn uống", True),
    "ăn uống": ("Ăn uống", True),
    "food": ("Ăn uống", True),
    "cafe": ("Ăn uống", True),
    "coffee": ("Ăn uống", True),
    "sieuthi": ("Siêu thị", True),
    "sieu thi": ("Siêu thị", True),
    "siêu thị": ("Siêu thị", True),
    "winmart": ("Siêu thị", True),
    "24 hours mart": ("Siêu thị", True),
    "muasam": ("Mua sắm", True),
    "mua sam": ("Mua sắm", True),
    "mua sắm": ("Mua sắm", True),
    "shopee": ("Mua sắm", True),
    "lazada": ("Mua sắm", True),
    "dichuyen": ("Di chuyển", True),
    "di chuyen": ("Di chuyển", True),
    "di chuyển": ("Di chuyển", True),
    "grab": ("Di chuyển", True),
    "taxi": ("Di chuyển", True),
    "xang": ("Di chuyển", True),
    "xăng": ("Di chuyển", True),
    "giadinh": ("Gia đình", True),
    "gia dinh": ("Gia đình", True),
    "gia đình": ("Gia đình", True),
    "nhatro": ("Nhà cửa", True),
    "nha tro": ("Nhà cửa", True),
    "nhà trọ": ("Nhà cửa", True),
    "hocphi": ("Học tập", True),
    "hoc phi": ("Học tập", True),
    "học phí": ("Học tập", True),
    "suckhoe": ("Sức khỏe", True),
    "suc khoe": ("Sức khỏe", True),
    "sức khỏe": ("Sức khỏe", True),
    "giaitri": ("Giải trí", True),
    "giai tri": ("Giải trí", True),
    "giải trí": ("Giải trí", True),
    "trano": ("Trả nợ", True),
    "tra no": ("Trả nợ", True),
    "trả nợ": ("Trả nợ", True),
    "noibo": ("Chuyển khoản nội bộ", False),
    "noi bo": ("Chuyển khoản nội bộ", False),
    "nội bộ": ("Chuyển khoản nội bộ", False),
    "tietkiem": ("Tiết kiệm", False),
    "tiet kiem": ("Tiết kiệm", False),
    "tiết kiệm": ("Tiết kiệm", False),
    "dautu": ("Đầu tư", False),
    "dau tu": ("Đầu tư", False),
    "đầu tư": ("Đầu tư", False),
}


KEYWORD_CATEGORIES: dict[str, str] = {
    keyword: category for keyword, (category, _include) in CONTENT_KEYWORD_CATEGORIES.items()
}


def categorize(transaction: Transaction) -> Transaction:
    if transaction.transaction_type == "income":
        transaction.category = "Thu nhập"
        transaction.category_source = "transaction_type"
        transaction.needs_review = False
        transaction.include_in_spending = False
        return transaction

    normalized_content = _normalize(transaction.content)
    for keyword, (category, include_in_spending) in CONTENT_KEYWORD_CATEGORIES.items():
        if _normalize(keyword) in normalized_content:
            transaction.category = category
            transaction.category_source = f"content_keyword:{keyword}"
            transaction.needs_review = False
            transaction.include_in_spending = include_in_spending
            return transaction

    transaction.category = "Cần phân loại"
    transaction.category_source = "needs_user_review"
    transaction.needs_review = True
    transaction.include_in_spending = False
    return transaction


def _normalize(value: str) -> str:
    value = value.lower().replace("đ", "d")
    normalized = unicodedata.normalize("NFD", value)
    return "".join(ch for ch in normalized if unicodedata.category(ch) != "Mn")
