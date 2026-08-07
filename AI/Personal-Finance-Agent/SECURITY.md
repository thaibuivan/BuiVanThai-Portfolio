# Security Policy

This project handles sensitive personal finance data. Public demos must use only synthetic data.

## Never Commit

- `.env`
- Telegram bot token
- Telegram chat ID
- Gemini API key
- Google OAuth client secret
- Gmail token or refresh token
- real bank emails
- real transaction spreadsheets
- screenshots containing real names, account fragments, balances, or transaction details

## Safe Public Demo

Use:

```text
sample_data/mock_transactions.csv
sample_data/mock_bank_emails/
```

These files are synthetic and designed for GitHub, CV, portfolio screenshots, and interview walkthroughs.

## LLM Privacy Boundary

Gemini should receive only:

- user finance question
- sanitized intent prompt
- aggregate metrics
- anonymized top recipient labels

Gemini should not receive:

- raw Gmail text
- OTPs
- API keys
- full account numbers
- full transaction histories
- OAuth tokens

