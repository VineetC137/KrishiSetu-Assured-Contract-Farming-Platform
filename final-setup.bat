@echo off
echo ========================================
echo    KrishiSetu Final Setup & Launch
echo ========================================
echo.

echo 1. Creating necessary directories...
cd backend
node create-directories.js
cd ..

echo.
echo 2. Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo 3. Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo 4. Starting MongoDB (if not running)...
echo Please ensure MongoDB is running on your system
echo.

echo 5. Starting backend server...
start "KrishiSetu Backend" cmd /k "cd backend && npm run dev"

echo.
echo 6. Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo 7. Starting frontend server...
start "KrishiSetu Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo 8. Waiting for frontend to start...
timeout /t 5 /nobreak > nul

echo.
echo ========================================
echo    KrishiSetu is now running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Test Accounts:
echo Farmer:  farmer@test.com / farmer123
echo Buyer:   buyer@test.com / buyer123
echo.
echo Features Available:
echo ✅ User Registration & Login
echo ✅ Profile Management with Photo Upload
echo ✅ Contract Creation & Management
echo ✅ PDF Contract Generation
echo ✅ Digital Signatures
echo ✅ Milestone Tracking
echo ✅ Wallet Management
echo ✅ Real-time Progress Updates
echo.
echo Press any key to run feature tests...
pause > nul

echo.
echo 9. Running feature tests...
node test-all-features.js

echo.
echo Setup complete! Both servers are running.
echo Press any key to exit...
pause > nul