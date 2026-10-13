@echo off
cd /d "%~dp0"
py -m pip install -r requirements.txt
if errorlevel 1 goto failed
py game.py
pause
exit /b
:failed
echo Installation failed. Check Python and your internet connection.
pause
