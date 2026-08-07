# Personal Finance Agent - Architecture

## Goal

Personal Finance Agent turns bank notification emails into structured transaction data, asks for human review when the category is ambiguous, and produces monthly dashboards and Telegram summaries.

The project is intentionally privacy-first:

- Raw Gmail content stays inside the user's Google account and Google Apps Script runtime.
- Telegram messages avoid OTPs, full account numbers, and raw credentials.
- Gemini receives only sanitized aggregates or a small privacy-safe intent prompt.
- Public demo data is synthetic and stored under `sample_data/`.

## Current Production Flow

```text
Bank transaction email
-> Gmail search query
-> Google Apps Script time trigger
-> transaction parser
-> duplicate check by transaction_id / email_id
-> Google Sheets Transactions table
-> category rule engine
-> Telegram review buttons when unclear
-> dashboard + report sheets
-> natural-language Telegram Q&A
```

## Components

### Gmail ingestion

The Apps Script trigger runs periodically and searches Gmail with a narrow query for bank transaction notifications. Each matching email is parsed into a normalized transaction object.

Important fields:

- `transaction_id`
- `bank`
- `occurred_at`
- `month`
- `transaction_type`
- `amount`
- `category`
- `review_status`
- `include_in_spending`
- `cashflow_type`
- `counterparty`
- `content`

### Parser

The parser extracts amount, transfer direction, timestamp, transaction content, and counterparty from MB Bank-style notification text. It also keeps raw metadata fields for debugging:

- `email_id`
- `raw_subject`
- `raw_from`
- `raw_snippet`

These columns are useful during development but should be hidden in a user-facing spreadsheet.

### Classification

The project uses a hybrid approach:

- Keyword rules for high-confidence labels such as `anuong`, `sieuthi`, `nhatro`, `trano`, `chovay`, and `thuhoino`.
- Human-in-the-loop review through Telegram buttons when content is missing or ambiguous.
- Optional Gemini intent parsing for natural-language questions, not for exposing raw transaction history.

This is more reliable than forcing ML on a small personal dataset.

### Debt and cashflow handling

Debt-related transfers are separated from normal living expenses to avoid double counting:

- `loan_in`: borrowed money received
- `loan_repayment`: principal repaid
- `loan_out`: money lent to another person
- `loan_collection`: money collected from a loan
- `saving`: saving or internal allocation
- `spending`: real living expense
- `income`: real income

The dashboard can show both living expense and debt movement without mixing them.

### Telegram bot

The bot supports two interaction modes:

- Button-based review for ambiguous transactions.
- Natural-language Q&A for monthly reports, category spend, debt status, dashboard, and charts.

The bot should answer finance-related questions only. Out-of-scope prompts are declined with a short explanation.

## Data Model

`Transactions` is the source-of-truth table. Dashboard and report sheets should be generated from it rather than manually edited.

Recommended public-facing columns:

- `bank`
- `occurred_at`
- `month`
- `transaction_type`
- `amount`
- `category`
- `review_status`
- `include_in_spending`
- `cashflow_type`
- `counterparty`
- `content`
- `debt_person`
- `principal_amount`
- `interest_amount`

Recommended hidden/debug columns:

- `transaction_id`
- `email_id`
- `telegram_message_id`
- `raw_subject`
- `raw_from`
- `raw_snippet`

## Free Deployment Choice

The current deployment target is Google Apps Script + Google Sheets because it is free-friendly for low personal usage and does not require a paid VPS.

Trade-offs:

- Near real-time, not true push real-time. Time triggers usually run around every minute.
- Apps Script quotas apply, so the Gmail query and Telegram calls should stay compact.
- This is appropriate for personal finance automation but not for a high-volume public SaaS.

## Portfolio Angle

For a Data Science CV, present this as an applied data product:

- Information extraction from semi-structured email text.
- Data quality controls and duplicate prevention.
- Human-in-the-loop labeling workflow.
- Privacy-safe LLM integration.
- Monthly analytics and explainable financial summaries.
- Evaluation plan for extraction accuracy and category classification.

