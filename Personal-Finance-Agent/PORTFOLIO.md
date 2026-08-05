# Personal Finance Agent

## One-Line Summary

A privacy-conscious personal finance agent that extracts bank transactions from Gmail, structures them in Google Sheets, asks for Telegram review when category confidence is low, and answers monthly finance questions with a rule-based + Gemini hybrid layer.

## Why This Project Matters

Most personal finance tracking fails because manual logging is annoying. Bank email notifications already contain the transaction signal, but they are messy, semi-structured, and not analysis-ready.

This project turns those notifications into a usable personal finance data product:

- Automated ingestion.
- Structured transaction records.
- Human-in-the-loop category correction.
- Debt-aware cashflow modeling.
- Dashboard and Telegram reporting.
- Privacy-safe LLM interface.

## Architecture

```text
Gmail transaction emails
-> Google Apps Script trigger
-> Parser + duplicate check
-> Google Sheets Transactions table
-> Category rules + Telegram review
-> Dashboard / Report / Debt Summary
-> Telegram commands + natural language Q&A
-> Gemini only receives sanitized aggregates
```

See `docs/architecture.md` for more detail.

## Main Features

- Gmail transaction polling with Apps Script.
- MB Bank-style email parser.
- Google Sheets as the free persistent database.
- Telegram notifications and category buttons.
- Monthly dashboard with category, counterparty, and daily spend views.
- Debt separation for borrowed money, repayments, lending, and collections.
- Natural-language finance Q&A with guardrails.
- Synthetic demo dataset for public screenshots.

## Data Science Angle

This is an applied data product rather than a pure ML notebook.

Relevant DS/analytics skills:

- Semi-structured text extraction.
- Data cleaning and normalization.
- Label taxonomy design.
- Rule-based baseline modeling.
- Human feedback loop.
- Metric design and dashboard reconciliation.
- Privacy-aware LLM orchestration.
- Evaluation planning.

## Why Rules + Human Review Instead Of Full ML?

Personal finance data is small, private, and high-stakes. A wrong category can distort the user's budget, debt tracking, and dashboard.

The current design uses rules for high-confidence cases and asks the user when the transfer content is unclear. Gemini is used for the conversational layer, not as the source of truth for transaction amounts.

This makes the system easier to audit and safer to use.

## Public Demo Data

Use:

```text
sample_data/mock_transactions.csv
sample_data/mock_bank_emails/
```

The sample data is fully synthetic. It includes multiple months, income, spending, debt movements, internal/saving transfers, and ambiguous transactions requiring review.

## Safe Demo Workflow

1. Create a separate Google Sheet named `Finance Agent Demo`.
2. Import `sample_data/mock_transactions.csv` into `Transactions`.
3. Copy the Apps Script files.
4. Run dashboard rebuild functions.
5. Take screenshots only from synthetic data.
6. Never show real Gmail, bank account data, Telegram token, Gemini API key, or OAuth credentials.

See `demo/README.md` for step-by-step instructions.

## Recommended CV Bullet

```text
Built a privacy-conscious personal finance agent using Google Apps Script, Gmail, Google Sheets, Telegram, and Gemini; implemented bank-email extraction, duplicate prevention, human-in-the-loop categorization, debt-aware cashflow analytics, dashboard automation, and privacy-safe natural-language reporting.
```

## Future Improvements

- Add parser fixtures for more banks.
- Add a lightweight evaluation harness.
- Add category recommendation as an assistive model.
- Add anomaly detection for unusual monthly spend.
- Create a polished demo dashboard with synthetic data for recruiters.

