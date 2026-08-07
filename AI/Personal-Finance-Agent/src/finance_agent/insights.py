from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime

from .models import Transaction


@dataclass(frozen=True)
class MonthlyContext:
    category_total: float
    month_total_expense: float
    category_budget: float | None = None


DEFAULT_CATEGORY_BUDGETS = {
    "Ăn uống": 4_000_000,
    "Di chuyển": 2_000_000,
    "Mua sắm": 4_000_000,
    "Siêu thị": 4_000_000,
    "Giải trí": 1_500_000,
    "Sức khỏe": 2_000_000,
}


def month_key(value: datetime | None) -> str:
    value = value or datetime.now()
    return value.strftime("%Y-%m")


def build_context(transaction: Transaction, all_transactions: list[Transaction]) -> MonthlyContext:
    current_month = month_key(transaction.occurred_at)
    month_transactions = [
        item
        for item in all_transactions
        if month_key(item.occurred_at) == current_month and item.transaction_type == "expense"
    ]
    category_total = sum(item.amount for item in month_transactions if item.category == transaction.category)
    month_total_expense = sum(item.amount for item in month_transactions)
    return MonthlyContext(
        category_total=category_total,
        month_total_expense=month_total_expense,
        category_budget=DEFAULT_CATEGORY_BUDGETS.get(transaction.category),
    )

