# Personal Finance Agent

A privacy-conscious personal finance agent that extracts bank transaction emails, structures them into a spreadsheet, asks for human review when categories are ambiguous, and provides Telegram reports, charts, and natural-language finance Q&A.

The current free-friendly implementation uses Google Apps Script, Google Sheets, Gmail, Telegram, and Gemini.

## What It Does

- Polls Gmail for bank transaction notifications.
- Parses semi-structured bank email text into normalized transaction rows.
- Prevents duplicate transactions.
- Classifies spending using keyword rules.
- Sends Telegram review buttons when a transaction is unclear.
- Separates living expenses from debt, loan, saving, and internal cashflows.
- Builds monthly dashboard/report sheets.
- Supports Telegram commands and natural-language finance questions.
- Uses Gemini only with sanitized aggregate data.

## Architecture

```text
Bank email
-> Gmail search
-> Google Apps Script trigger
-> transaction parser
-> Google Sheets Transactions table
-> rule-based classification
-> Telegram human review
-> dashboard/report generation
-> Telegram command and natural-language Q&A
```

See [docs/architecture.md](docs/architecture.md) for details.

## Repository Structure

```text
apps_script/      Google Apps Script source and manifest
docs/             architecture, case study, and evaluation plan
demo/             safe demo instructions
sample_data/      synthetic public demo transactions and mock emails
src/              earlier local Python implementation
scripts/          local helper scripts
data/             local private outputs, ignored by git
config/           local private credentials, ignored by git
```

## Portfolio Materials

Start with:

- [PORTFOLIO.md](PORTFOLIO.md)
- [docs/portfolio_case_study.md](docs/portfolio_case_study.md)
- [docs/evaluation_plan.md](docs/evaluation_plan.md)
- [demo/README.md](demo/README.md)

The public demo data is fully synthetic:

```text
sample_data/mock_transactions.csv
sample_data/mock_bank_emails/
```

Do not use real bank data, Gmail screenshots, tokens, or OAuth credentials in public screenshots.

## Telegram Commands

The bot supports commands such as:

```text
/help
/report
/dashboard
/chart
/top
/debt
/uncategorized
/review
```

It also supports Vietnamese natural-language prompts such as:

```text
report thang 7
chi tieu thang 8 cua toi
an uong thang 7 bao nhieu
toi con no ai
gui bieu do thang 7
```

## Data Model

The main table is `Transactions`.

Core analytical fields:

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

Debug/private fields:

- `transaction_id`
- `email_id`
- `telegram_message_id`
- `raw_subject`
- `raw_from`
- `raw_snippet`

## Privacy And Security

Never commit:

- `.env`
- Telegram bot tokens
- Gemini API keys
- Google OAuth credentials
- Gmail refresh tokens
- real Excel exports
- raw bank emails
- screenshots containing real transaction details

The `.gitignore` is configured to exclude those files.

## Local Python MVP

The repository also contains an earlier local Python implementation under `src/finance_agent`.

Install dependencies:

```bash
pip install -r requirements.txt
```

Run local Gmail polling:

```bash
python -m finance_agent.cli poll-gmail
```

For the current always-on free workflow, prefer the Apps Script implementation in `apps_script/`.

## Recommended CV Bullet

```text
Built a privacy-conscious personal finance agent using Google Apps Script, Gmail, Google Sheets, Telegram, and Gemini; implemented bank-email extraction, duplicate prevention, human-in-the-loop categorization, debt-aware cashflow analytics, dashboard automation, and privacy-safe natural-language reporting.
```
