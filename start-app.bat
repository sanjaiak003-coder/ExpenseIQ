@echo off
title ExpenseIQ Launcher
echo ===================================================
echo   Starting ExpenseIQ Full-Stack MERN Application
echo ===================================================

echo [1/2] Launching Backend Server on port 5000...
start "ExpenseIQ Backend Server (Port 5000)" cmd /k "cd /d ""%~dp0server"" && node index.js"

echo [2/2] Launching Frontend Vite Client on port 5173...
start "ExpenseIQ Frontend UI (Port 5173)" cmd /k "cd /d ""%~dp0client"" && npx vite --host --port 5173"

echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ===================================================
echo   ExpenseIQ is now running!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ===================================================