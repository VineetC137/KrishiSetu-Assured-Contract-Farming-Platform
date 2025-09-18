@echo off
echo Starting KrishiSetu with AI Chatbot...
echo.

echo Starting MongoDB (if not running)...
start "MongoDB" cmd /k "mongod --dbpath ./data/db"
timeout /t 3 /nobreak > nul

echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm start"
timeout /t 5 /nobreak > nul

echo Starting Frontend Development Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ All services started!
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:5000
echo 🤖 AI Chatbot: Integrated in the platform
echo.
echo Press any key to close this window...
pause > nul
