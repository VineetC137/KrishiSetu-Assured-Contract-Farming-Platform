@echo off
cls
echo.
echo ========================================
echo    🌱 KrishiSetu Platform Startup
echo ========================================
echo.

REM Check Node.js
echo [1/7] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Check MongoDB
echo [2/7] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB not found. Installing MongoDB Community Server...
    echo Please install from: https://www.mongodb.com/try/download/community
    pause
)
net start MongoDB >nul 2>&1
echo ✅ MongoDB is ready

REM Install Backend Dependencies
echo [3/7] Installing backend dependencies...
cd backend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Backend installation failed
        pause
        exit /b 1
    )
)
echo ✅ Backend dependencies ready

REM Install Frontend Dependencies
echo [4/7] Installing frontend dependencies...
cd ../frontend
if not exist node_modules (
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Frontend installation failed
        pause
        exit /b 1
    )
)
echo ✅ Frontend dependencies ready

cd ..

REM Setup Database
echo [5/7] Setting up database...
cd backend
node reset-database.js >nul 2>&1
echo ✅ Database initialized with test data

REM Start Backend
echo [6/7] Starting backend server...
start "🔧 KrishiSetu Backend" cmd /k "echo 🚀 Starting KrishiSetu Backend Server... && echo. && npm start"

REM Wait and test backend
echo [7/7] Testing backend connection...
timeout /t 8 /nobreak >nul
cd ..
node quick-test.js

REM Start Frontend
echo.
echo 🎨 Starting frontend server...
start "🌐 KrishiSetu Frontend" cmd /k "cd frontend && echo 🚀 Starting KrishiSetu Frontend... && echo. && npm run dev"

echo.
echo ========================================
echo    🎉 KrishiSetu is Starting Up!
echo ========================================
echo.
echo 🌐 Frontend:  http://localhost:3000
echo 🔧 Backend:   http://localhost:5000
echo.
echo 👤 Test Accounts:
echo    📧 farmer@test.com  🔑 farmer123
echo    📧 buyer@test.com   🔑 buyer123
echo.
echo 📋 What to do next:
echo    1. Wait for both servers to fully start
echo    2. Open http://localhost:3000 in your browser
echo    3. Click "Login" and use test credentials
echo    4. Explore the platform features!
echo.
echo 🐛 If you encounter issues:
echo    - Check both server windows for errors
echo    - Ensure ports 3000 and 5000 are free
echo    - Try refreshing the browser page
echo.
echo Press any key to close this window...
pause >nul