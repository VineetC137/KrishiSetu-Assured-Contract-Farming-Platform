@echo off
echo ========================================
echo    KrishiSetu Development Setup
echo ========================================
echo.

REM Check if MongoDB is running
echo [1/4] Checking MongoDB...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo MongoDB service not found or already running
)

REM Reset database with fresh data
echo [2/4] Resetting database with fresh data...
cd backend
node reset-database.js
if %errorlevel% neq 0 (
    echo Warning: Database reset failed, continuing anyway...
)
cd ..

REM Start Backend Server
echo [3/4] Starting Backend Server...
start "KrishiSetu Backend" cmd /k "cd backend && echo Starting backend server... && npm start"

REM Wait for backend to start
echo Waiting for backend to start...
timeout /t 8 /nobreak >nul

REM Start Frontend Server
echo [4/4] Starting Frontend Server...
start "KrishiSetu Frontend" cmd /k "cd frontend && echo Starting frontend server... && npm run dev"

echo.
echo ========================================
echo    Servers are starting...
echo ========================================
echo Backend API: http://localhost:5000
echo Frontend:    http://localhost:3000
echo.
echo Test Accounts:
echo Farmer: farmer@test.com / farmer123
echo Buyer:  buyer@test.com / buyer123
echo.
echo Press any key to close this window...
pause >nul
