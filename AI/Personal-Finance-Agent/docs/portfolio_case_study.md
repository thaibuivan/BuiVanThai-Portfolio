# Portfolio Case Study - Personal Finance Agent

## Problem

Bank emails contain useful transaction data, but they are difficult to analyze manually. Personal finance apps often require manual entry, while bank notifications alone do not explain spending behavior or debt movement.

The goal was to build a free, privacy-conscious agent that:

- Reads bank transaction emails automatically.
- Converts messy notification text into structured rows.
- Classifies spend with rules and human review.
- Separates debt cashflows from real expenses.
- Produces dashboards and Telegram summaries.
- Answers finance questions in natural language.

## Users

Primary user: an individual who wants a lightweight personal finance assistant without paying for a cloud server.

Secondary demo user: recruiters or interviewers reviewing the project through synthetic data and screenshots.

## Solution

The agent runs on Google Apps Script and stores data in Google Sheets. Telegram acts as the user interface for alerts, review buttons, reports, charts, and natural-language questions.

The system uses a pragmatic hybrid design:

- Rules handle deterministic finance logic.
- Telegram review handles ambiguous cases.
- Gemini helps interpret natural-language requests and produce more readable summaries.

## Why Not Pure ML?

The data volume is small and the cost of misclassification is high. A rule-first system is easier to audit and safer for real personal finance.

ML/LLM is used only where it adds value:

- Understanding varied user questions.
- Turning structured metrics into concise explanations.
- Supporting future experimentation with category prediction.

## Key Features

- Gmail ingestion with duplicate protection.
- MB Bank transaction parser.
- Google Sheets transaction database.
- Category rules based on transfer content.
- Human-in-the-loop Telegram category buttons.
- Debt-aware cashflow model.
- Monthly dashboard with category, counterparty, and daily spend views.
- Telegram commands and natural-language Q&A.
- Privacy guardrails for LLM calls.
- Synthetic demo dataset for public portfolio use.

## Data Science Framing

This project can be framed as an end-to-end applied data system:

- Semi-structured text extraction.
- Label taxonomy design.
- Data quality validation.
- Human feedback loop.
- Aggregation and dashboarding.
- Privacy-preserving LLM orchestration.
- Evaluation plan for parser and classification quality.

## Demo Dataset

The public demo uses synthetic transactions in `sample_data/mock_transactions.csv`.

The dataset includes:

- Multiple months.
- Income and expense transactions.
- Ambiguous rows requiring review.
- Loan-in, loan-out, repayment, and collection cases.
- Internal/saving rows excluded from living expense.

This allows public screenshots and walkthroughs without exposing real Gmail, bank data, names, or account fragments.

## Example Telegram Prompts

```text
report tháng 7
chi tiêu tháng 8 của tôi
ăn uống tháng 7 bao nhiêu
tôi còn nợ ai
gửi biểu đồ tháng 7
top chi tiêu tháng này
```

## Limitations

- Apps Script time triggers are near real-time, not instant webhooks.
- The parser currently targets MB Bank-style notification text.
- Category accuracy depends on transfer keywords and user review.
- LLM responses are constrained to finance-related questions and sanitized aggregates.

## Next Iterations

- Add parser test cases for more banks.
- Build a labeled evaluation set from synthetic and anonymized examples.
- Add category prediction as a recommendation layer, not an automatic final decision.
- Add anomaly detection for unusual monthly spikes.
- Add Looker Studio or a polished public dashboard using synthetic data.

