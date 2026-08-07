# ML-Based Time Series Backtesting Strategy

## Project Overview

This project builds a data science pipeline for analyzing ETH/USDT time-series market data and testing machine-learning-based trading signals. The focus is on feature engineering, model evaluation, backtesting logic, and risk-aware performance analysis rather than live trading.

## What This Project Covers

- Cleaned and prepared OHLCV time-series data.
- Analyzed log returns, distribution behavior, volatility, and stationarity.
- Engineered technical and time-series features for short-term movement prediction.
- Trained and evaluated Logistic Regression and XGBoost classification models.
- Integrated prediction probabilities into a rule-based backtesting strategy.
- Compared strategy performance against a Buy & Hold benchmark.
- Evaluated performance using return, Sharpe ratio, max drawdown, win rate, and sensitivity analysis.

## Files

- `ML_Time_Series_Backtesting.ipynb`: Main notebook containing data processing, modeling, evaluation, and backtesting.
- `ML_Time_Series_Backtesting_Report.pdf`: Final project report.

## Technologies

- Python
- pandas, NumPy
- scikit-learn, XGBoost
- statsmodels
- VectorBT
- matplotlib, seaborn

## Notes

This is an academic data science project. It is intended for learning and portfolio demonstration, not financial advice or a production trading system.
