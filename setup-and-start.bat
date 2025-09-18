@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    KrishiSetu Complete Setup
echo ========================================
echo.

REM Check Node.js installation
echo [1/8] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Check MongoDB installation
echo [2/8] Checking MongoDB...
net start MongoDB 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB service not found. Trying to start MongoDB...
    mongod --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ MongoDB is not installed. Please install MongoDB first.
        pause
        exit /b 1
    )
)
echo ✅ MongoDB is ready

REM Install backend dependencies
echo [3/8] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

REM Install frontend dependencies
echo [4/8] Installing frontend dependencies...
cd ../frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed

cd ..

REM Reset database with fresh data
echo [5/8] Setting up database with test data...
cd backend
node reset-database.js
if %errorlevel% neq 0 (
    echo ⚠️  Database setup failed, but continuing...
)
echo ✅ Database setup complete
cd ..

REM Start Backend Server
echo [6/8] Starting Backend Server...
start "KrishiSetu Backend" cmd /k "cd backend && echo ✅ Backend server starting... && npm start"

REM Wait for backend to start
echo [7/8] Waiting for backend to initialize...
timeout /t 10 /nobreak >nul

REM Test backend connection
echo Testing backend connection...
node test-connection.js

REM Start Frontend Server
echo [8/8] Starting Frontend Server...
start "KrishiSetu Frontend" cmd /k "cd frontend && echo ✅ Frontend server starting... && npm run dev"

echo.
echo ========================================
echo    🎉 KrishiSetu is starting up!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo.
echo 👤 Test Accounts:
echo    Farmer: farmer@test.com / farmer123
echo    Buyer:  buyer@test.com / buyer123
echo.
echo 📝 Instructions:
echo    1. Wait for both servers to fully start
echo    2. Open http://localhost:3000 in your browser
echo    3. Use the test accounts to login
echo.
echo Press any key to close this setup window...
pause >nul