from __future__ import annotations

import csv
import html
import math
from collections import defaultdict
from datetime import datetime
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "sample_data" / "mock_transactions.csv"
ASSET_DIR = ROOT / "assets"


CATEGORY_LABELS = {
    "Ăn uống": "Food",
    "Siêu thị": "Supermarket",
    "Mua sắm": "Shopping",
    "Di chuyển": "Transport",
    "Nhà cửa": "Housing",
    "Học tập": "Education",
    "Sức khỏe": "Health",
    "Giải trí": "Entertainment",
    "Thu nhập": "Income",
    "Vay nhận vào": "Borrowed",
    "Trả nợ gốc": "Debt repayment",
    "Cho vay": "Lent out",
    "Thu hồi cho vay": "Loan collection",
    "Cần phân loại": "Needs review",
    "Tiết kiệm": "Saving",
}

PALETTE = ["#2563eb", "#16a34a", "#f97316", "#dc2626", "#7c3aed", "#0891b2", "#ca8a04", "#be185d"]


def esc(value: object) -> str:
    return html.escape(str(value), quote=True)


def money(value: float) -> str:
    return f"{int(round(value)):,.0f} VND"


def load_rows() -> list[dict[str, str]]:
    with CSV_PATH.open("r", encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def latest_month(rows: list[dict[str, str]]) -> str:
    return sorted({row["month"] for row in rows})[-1]


def month_rows(rows: list[dict[str, str]], month: str) -> list[dict[str, str]]:
    return [row for row in rows if row["month"] == month]


def amount(row: dict[str, str]) -> float:
    return float(row.get("amount") or 0)


def is_living_spend(row: dict[str, str]) -> bool:
    return row.get("include_in_spending") == "TRUE"


def write_svg(name: str, body: str, width: int, height: int) -> None:
    ASSET_DIR.mkdir(exist_ok=True)
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img">
  <title>{esc(name)}</title>
  <rect width="{width}" height="{height}" fill="#f8fafc"/>
  <style>
    .title {{ font: 700 30px Arial, sans-serif; fill: #0f172a; }}
    .subtitle {{ font: 400 15px Arial, sans-serif; fill: #475569; }}
    .label {{ font: 600 13px Arial, sans-serif; fill: #334155; }}
    .small {{ font: 400 12px Arial, sans-serif; fill: #64748b; }}
    .value {{ font: 700 24px Arial, sans-serif; fill: #0f172a; }}
    .axis {{ stroke: #cbd5e1; stroke-width: 1; }}
    .grid {{ stroke: #e2e8f0; stroke-width: 1; }}
    .panel {{ fill: #ffffff; stroke: #e2e8f0; stroke-width: 1; rx: 14; }}
  </style>
{body}
</svg>
"""
    (ASSET_DIR / name).write_text(svg, encoding="utf-8")


def rect(x: float, y: float, w: float, h: float, fill: str, stroke: str = "none", radius: int = 8) -> str:
    return f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{radius}" fill="{fill}" stroke="{stroke}"/>'


def text(x: float, y: float, value: object, css: str = "label", anchor: str = "start") -> str:
    return f'<text x="{x:.1f}" y="{y:.1f}" class="{css}" text-anchor="{anchor}">{esc(value)}</text>'


def dashboard_svg(rows: list[dict[str, str]]) -> None:
    month = latest_month(rows)
    current = month_rows(rows, month)
    income = sum(amount(row) for row in current if row["cashflow_type"] == "income")
    spend = sum(amount(row) for row in current if is_living_spend(row))
    needs_review = sum(1 for row in current if row["review_status"] == "needs_review")
    transactions = len(current)

    category_totals: dict[str, float] = defaultdict(float)
    counterparty_totals: dict[str, float] = defaultdict(float)
    daily_totals: dict[str, float] = defaultdict(float)
    for row in current:
        if is_living_spend(row):
            category_totals[CATEGORY_LABELS.get(row["category"], row["category"])] += amount(row)
            counterparty_totals[row["counterparty"]] += amount(row)
            daily_totals[row["occurred_at"][:10]] += amount(row)

    top_categories = sorted(category_totals.items(), key=lambda item: item[1], reverse=True)[:5]
    top_counterparties = sorted(counterparty_totals.items(), key=lambda item: item[1], reverse=True)[:6]

    body = []
    body.append(text(44, 54, "Personal Finance Agent Dashboard", "title"))
    body.append(text(44, 80, f"Synthetic portfolio demo | Month {month}", "subtitle"))

    cards = [
        ("Transactions", transactions),
        ("Living spend", money(spend)),
        ("Income", money(income)),
        ("Needs review", needs_review),
    ]
    for index, (label, value) in enumerate(cards):
        x = 44 + index * 265
        body.append(rect(x, 110, 235, 96, "#ffffff", "#e2e8f0", 14))
        body.append(text(x + 22, 142, label, "small"))
        body.append(text(x + 22, 178, value, "value"))

    body.append(rect(44, 236, 520, 360, "#ffffff", "#e2e8f0", 14))
    body.append(text(70, 272, "Spend by category", "label"))
    max_category = max((value for _, value in top_categories), default=1)
    for index, (category, value) in enumerate(top_categories):
        y = 315 + index * 48
        bar_w = 350 * value / max_category
        body.append(text(70, y + 18, category, "small"))
        body.append(rect(190, y, 350, 18, "#e2e8f0", "none", 6))
        body.append(rect(190, y, bar_w, 18, PALETTE[index % len(PALETTE)], "none", 6))
        body.append(text(540, y + 15, money(value), "small", "end"))

    body.append(rect(596, 236, 520, 360, "#ffffff", "#e2e8f0", 14))
    body.append(text(622, 272, "Top recipients", "label"))
    max_counterparty = max((value for _, value in top_counterparties), default=1)
    chart_x, chart_y, chart_w, chart_h = 640, 322, 420, 210
    body.append(f'<line x1="{chart_x}" y1="{chart_y + chart_h}" x2="{chart_x + chart_w}" y2="{chart_y + chart_h}" class="axis"/>')
    for index, (name, value) in enumerate(top_counterparties):
        bar_h = chart_h * value / max_counterparty
        x = chart_x + index * 66
        y = chart_y + chart_h - bar_h
        body.append(rect(x, y, 42, bar_h, PALETTE[index % len(PALETTE)], "none", 5))
        short_name = name.replace(" DEMO", "")[:12]
        body.append(text(x + 21, chart_y + chart_h + 24, short_name, "small", "middle"))
    body.append(text(chart_x + chart_w, chart_y - 12, money(max_counterparty), "small", "end"))

    body.append(rect(44, 626, 1072, 300, "#ffffff", "#e2e8f0", 14))
    body.append(text(70, 662, "Daily living spend", "label"))
    days = []
    start = datetime.strptime(month + "-01", "%Y-%m-%d")
    for day in range(1, 32):
        key = f"{month}-{day:02d}"
        days.append((key, daily_totals.get(key, 0)))
    max_day = max((value for _, value in days), default=1)
    px, py, pw, ph = 88, 705, 980, 160
    for tick in range(5):
        y = py + ph - tick * ph / 4
        body.append(f'<line x1="{px}" y1="{y:.1f}" x2="{px + pw}" y2="{y:.1f}" class="grid"/>')
        body.append(text(px - 10, y + 4, money(max_day * tick / 4), "small", "end"))
    points = []
    for index, (_, value) in enumerate(days):
        x = px + index * pw / (len(days) - 1)
        y = py + ph - (value / max_day * ph if max_day else 0)
        points.append(f"{x:.1f},{y:.1f}")
    body.append(f'<polyline points="{" ".join(points)}" fill="none" stroke="#2563eb" stroke-width="3"/>')
    for index, (key, value) in enumerate(days):
        if value > 0:
            x = px + index * pw / (len(days) - 1)
            y = py + ph - value / max_day * ph
            body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="4" fill="#2563eb"/>')
    for day in [1, 8, 15, 22, 29]:
        x = px + (day - 1) * pw / (len(days) - 1)
        body.append(text(x, py + ph + 30, f"{month}-{day:02d}", "small", "middle"))

    write_svg("dashboard-demo.svg", "\n".join(body), 1160, 960)


def architecture_svg() -> None:
    steps = [
        ("Gmail", "Bank notification emails"),
        ("Parser", "Extract amount, time, content"),
        ("Sheets", "Transactions as source of truth"),
        ("Rules", "Category and cashflow logic"),
        ("Telegram", "Human review and commands"),
        ("Gemini", "Privacy-safe natural Q&A"),
    ]
    body = []
    body.append(text(44, 58, "System Architecture", "title"))
    body.append(text(44, 84, "Free-friendly workflow for personal finance automation", "subtitle"))
    for index, (title, subtitle) in enumerate(steps):
        x = 60 + index * 182
        y = 190 if index % 2 == 0 else 350
        body.append(rect(x, y, 150, 96, "#ffffff", "#cbd5e1", 14))
        body.append(text(x + 18, y + 36, title, "label"))
        body.append(text(x + 18, y + 62, subtitle[:24], "small"))
        body.append(text(x + 18, y + 80, subtitle[24:], "small"))
        if index < len(steps) - 1:
            x2 = 60 + (index + 1) * 182
            y2 = 190 if (index + 1) % 2 == 0 else 350
            body.append(f'<line x1="{x + 150}" y1="{y + 48}" x2="{x2}" y2="{y2 + 48}" stroke="#2563eb" stroke-width="3" marker-end="url(#arrow)"/>')
    body.insert(0, '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#2563eb"/></marker></defs>')
    body.append(rect(80, 540, 1000, 110, "#eff6ff", "#bfdbfe", 14))
    body.append(text(112, 580, "Privacy boundary", "label"))
    body.append(text(112, 612, "Raw Gmail content and credentials stay out of public demos. Gemini receives only sanitized aggregates.", "subtitle"))
    write_svg("pipeline-architecture.svg", "\n".join(body), 1160, 720)


def telegram_svg() -> None:
    body = []
    body.append(rect(0, 0, 760, 820, "#d9fdd3", "none", 0))
    body.append(rect(0, 0, 760, 72, "#ffffff", "#e2e8f0", 0))
    body.append(text(28, 45, "Thai Finance Agent", "label"))
    body.append(text(650, 45, "bot", "small"))

    bubbles = [
        (42, 112, 500, 112, "#ffffff", "Need review: 120,000 VND at UNKNOWN SHOP DEMO. Choose a category to include it in the dashboard."),
        (368, 254, 332, 54, "#dcf8c6", "Ăn uống"),
        (42, 350, 548, 152, "#ffffff", "Updated. August living spend is 3,826,000 VND across 10 transactions. Biggest category is Housing at 2,500,000 VND."),
        (310, 540, 390, 54, "#dcf8c6", "chi tiêu tháng 8 của tôi"),
        (42, 632, 568, 116, "#ffffff", "Month 2026-08: living spend 3,826,000 VND, income 16,000,000 VND, net cashflow 12,174,000 VND. Answered with Gemini using sanitized metrics."),
    ]
    for x, y, w, h, fill, content in bubbles:
        body.append(rect(x, y, w, h, fill, "#cbd5e1", 16))
        words = content.split()
        line = ""
        lines = []
        for word in words:
            if len(line + " " + word) > 58:
                lines.append(line)
                line = word
            else:
                line = (line + " " + word).strip()
        if line:
            lines.append(line)
        for index, line_text in enumerate(lines[:5]):
            body.append(text(x + 22, y + 34 + index * 22, line_text, "subtitle"))

    write_svg("telegram-demo.svg", "\n".join(body), 760, 820)


def main() -> None:
    rows = load_rows()
    dashboard_svg(rows)
    architecture_svg()
    telegram_svg()
    print(f"Generated assets in {ASSET_DIR}")


if __name__ == "__main__":
    main()
