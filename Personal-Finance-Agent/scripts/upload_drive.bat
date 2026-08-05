@echo off
setlocal
cd /d "%~dp0\.."

call "%USERPROFILE%\anaconda3\Scripts\activate.bat" finance-agent
if errorlevel 1 (
  echo Could not activate the Conda environment: finance-agent
  echo Make sure Anaconda is installed under %%USERPROFILE%%\anaconda3
  exit /b 1
)

set PYTHONPATH=src
set PYTHONUTF8=1
python -m finance_agent.cli upload-drive
