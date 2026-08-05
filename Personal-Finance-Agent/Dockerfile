FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONUTF8=1
ENV PYTHONPATH=/app/src

WORKDIR /app

COPY requirements.txt pyproject.toml ./
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
COPY scripts ./scripts

RUN mkdir -p /app/data /app/config

CMD ["python", "-m", "finance_agent.cli", "watch-gmail", "--interval", "60", "--limit", "100", "--query", "newer_than:2d"]
