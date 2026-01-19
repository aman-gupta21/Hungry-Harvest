@echo off
REM Food Delivery App - Backend Setup Script for Windows
REM This script sets up the backend for local development or deployment

setlocal enabledelayedexpansion

echo.
echo ==================================================
echo 🍔 Food Delivery App - Backend Setup
echo ==================================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo Error: package.json not found
    echo Please run this script from the backend directory
    pause
    exit /b 1
)

REM Step 1: Install dependencies
echo [Step 1] Installing dependencies...
call npm install
if errorlevel 1 (
    echo Error: npm install failed
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Step 2: Check for .env file
echo [Step 2] Checking environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env from .env.example...
        copy .env.example .env
        echo ⚠️  Please edit .env with your credentials:
        echo    - MongoUri
        echo    - JWT_SECRET
        echo    - STRIPE_SECRET_KEY
        echo    - CLOUDINARY_NAME
        echo    - CLOUDINARY_API_KEY
        echo    - CLOUDINARY_API_SECRET
        echo.
    ) else (
        echo Error: .env.example not found
        pause
        exit /b 1
    )
) else (
    echo ✓ .env file exists
    echo Please verify .env has actual credentials before deployment
)
echo.

REM Step 3: Create uploads directory
echo [Step 3] Setting up directories...
if not exist "uploads" (
    mkdir uploads
)
echo ✓ uploads directory ready
echo.

REM Step 4: Check Node.js version
echo [Step 4] Checking Node.js version...
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%
echo.

REM Step 5: Check npm version
echo [Step 5] Checking npm version...
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo ✓ npm version: %NPM_VERSION%
echo.

REM Step 6: Display next steps
echo ==================================================
echo ✓ Backend setup complete!
echo ==================================================
echo.
echo Next steps:
echo.
echo 1. Edit .env file with your credentials:
echo    notepad .env
echo.
echo 2. Start development server:
echo    npm run dev
echo.
echo 3. Test the API:
echo    curl http://localhost:4000/
echo.
echo 4. Read deployment guides:
echo    - QUICK_START.md (for fast deployment)
echo    - DEPLOYMENT_GUIDE.md (for detailed setup)
echo.
echo Happy coding! 🚀
echo.
pause
