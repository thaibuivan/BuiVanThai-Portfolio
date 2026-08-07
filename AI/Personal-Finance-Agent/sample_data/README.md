# Sample Data

This folder contains synthetic data for portfolio demos. None of the rows are copied from a real bank account, Gmail inbox, Telegram chat, or Google Sheet.

Use this data when you want to show the project publicly without exposing personal finance data.

## Files

- `mock_transactions.csv`: synthetic rows following the real `Transactions` sheet schema.
- `mock_bank_emails/`: synthetic MB Bank-style email snippets for parser and ingestion demonstrations.

## Demo Coverage

The mock data intentionally includes:

- Regular spending: food, supermarket, shopping, transport, housing, health, education, entertainment.
- Income.
- Debt cashflows: borrowed money, principal repayment, money lent to others, loan collection.
- Internal transfer and savings/investment rows that should not count as living expense.
- A few `needs_review` rows to demonstrate human-in-the-loop classification.
- Multiple months so the bot can answer month-specific questions such as `report thang 7` or `chi tieu thang 8`.

## Privacy Note

Names, account fragments, email IDs, message IDs, and transaction IDs are fake. Use this dataset for screenshots, GitHub, portfolio pages, and CV demos.

## Import Note

The CSV uses plain numeric `amount` values and comma-free snippets so it can be imported directly into Google Sheets without shifting columns.

Recommended import target:

```text
Sheet name: Transactions
Separator: comma
Convert text to numbers and dates: enabled
```
