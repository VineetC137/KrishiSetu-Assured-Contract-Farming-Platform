@echo off
echo Setting up KrishiSetu Platform...

echo.
echo Installing root dependencies...
call npm install

echo.
echo Installing backend dependencies...
cd backend
call npm install
cd ..

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Make sure MongoDB is running
echo 2. Run: npm run dev
echo.
echo Test accounts:
echo Farmer: farmer@test.com / farmer123
echo Buyer: buyer@test.com / buyer123
echo.
pause