@echo off
echo ========================================
echo    🌾 KrishiSetu Platform Startup 🌾
echo ========================================
echo.

echo 🚀 Starting Backend Server...
start "KrishiSetu Backend" cmd /k "cd backend && echo Backend starting... && npm start"

echo ⏳ Waiting for backend to initialize...
timeout /t 8 /nobreak > nul

echo 🎨 Starting Frontend Server...
start "KrishiSetu Frontend" cmd /k "cd frontend && echo Frontend starting... && npm run dev"

echo.
echo ✅ Both servers are starting up!
echo.
echo 📍 Access URLs:
echo    Backend API: http://localhost:5000
echo    Frontend:    http://localhost:3000
echo.
echo 👤 Test Accounts:
echo    Farmer:  farmer@test.com  / password123
echo    Buyer:   buyer@test.com   / password123
echo.
echo 🧪 To test fixes:
echo    1. Login with test account
echo    2. Try PDF download from contracts
echo    3. Test AI chatbot (bottom-right button)
echo.
echo Press any key to close this window...
pause > nul