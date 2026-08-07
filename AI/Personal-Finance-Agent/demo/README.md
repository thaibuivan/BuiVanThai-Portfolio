# Demo Guide

Use this guide to create a public-safe demo of the finance agent.

## 1. Create a Demo Google Sheet

Create a new Google Sheet named:

```text
Finance Agent Demo
```

Import:

```text
sample_data/mock_transactions.csv
```

into a sheet named:

```text
Transactions
```

This data is synthetic and safe for screenshots.

## 2. Copy Apps Script

Open the demo sheet:

```text
Extensions -> Apps Script
```

Copy `apps_script/Code.gs` and `apps_script/appsscript.json` into the Apps Script project.

For a pure portfolio screenshot, you can skip real Telegram and Gmail credentials. Use real script properties only when testing the live bot privately.

## 3. Safe Script Properties

Private live testing needs:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
GEMINI_API_KEY
```

Never put these values into GitHub, screenshots, slides, or CV material.

## 4. Build Dashboard

Run:

```text
forceRebuildDashboard
```

or:

```text
repairAndRefreshDashboard
```

Then open the `Dashboard` and `Report` sheets.

## 5. Telegram Demo Prompts

If Telegram is enabled, test:

```text
/help
/report
/dashboard
/chart
report tháng 7
chi tiêu tháng 8 của tôi
ăn uống tháng 7 bao nhiêu
tôi còn nợ ai
gửi biểu đồ tháng 7
```

## 6. Suggested Screenshots

Use synthetic data only.

- Transaction table with debug columns hidden.
- Dashboard monthly summary.
- Telegram human-review category buttons.
- Telegram natural-language finance answer.
- Apps Script trigger page showing automated polling.

## 7. What To Say In A CV

Short version:

```text
Built a privacy-conscious personal finance agent that extracts bank transactions from Gmail, classifies spending with rule-based and human-in-the-loop workflows, updates Google Sheets dashboards, and supports Telegram Q&A using Gemini with sanitized aggregate data.
```

