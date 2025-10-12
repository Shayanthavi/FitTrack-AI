@echo off
echo ========================================
echo FitTrack AI - Windows Setup Script
echo ========================================
echo.

echo Step 1: Checking if Node.js is installed...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

echo.
echo Step 2: Checking if MySQL is installed...
where mysql >nul 2>nul
if %errorlevel% neq 0 (
    echo WARNING: MySQL command not found in PATH
    echo Make sure MySQL is installed and running
)
echo.

echo Step 3: Setting up Backend...
cd backend
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
    echo ⚠ IMPORTANT: Please edit backend\.env and update your MySQL password!
    pause
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

cd ..

echo.
echo Step 4: Setting up Frontend...
cd frontend_fitness
if not exist .env (
    echo Creating .env file from example...
    copy .env.example .env
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Installing lottie-react...
call npm install lottie-react
echo ✓ Frontend dependencies installed

cd ..

echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo NEXT STEPS:
echo 1. Create MySQL database (see QUICK_START.md for SQL commands)
echo 2. Update backend\.env with your MySQL password
echo 3. Run start_backend.bat in one terminal
echo 4. Run start_frontend.bat in another terminal
echo 5. Open http://localhost:5173 in your browser
echo.
echo See QUICK_START.md for detailed instructions
echo ========================================
pause
