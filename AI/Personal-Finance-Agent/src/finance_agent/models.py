from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class EmailRecord:
    email_id: str
    subject: str
    sender: str
    received_at: datetime | None
    body: str


@dataclass
class Transaction:
    transaction_id: str
    email_id: str
    source: str
    bank: str
    occurred_at: datetime | None
    transaction_type: str
    amount: float
    currency: str
    content: str
    sender: str
    receiver: str
    account_hint: str
    balance_after: float | None
    category: str
    raw_subject: str
    raw_from: str
    raw_snippet: str
    category_source: str = "unknown"
    needs_review: bool = True
    include_in_spending: bool = True
