@echo off
REM MangaVerse Quick Setup Script for Windows
REM This script helps set up the project for first-time users

echo.
echo ================================================
echo        MangaVerse Setup Script (Windows)
echo ================================================
echo.

REM Check if .env exists
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo [!] IMPORTANT: Edit .env and update MONGODB_URI with your database connection!
    echo     - For MongoDB Atlas: Get connection string from https://cloud.mongodb.com
    echo     - For local MongoDB: mongodb://localhost:27017/mangaverse
    echo.
    pause
) else (
    echo .env file already exists
)

REM Check if node_modules exists
if not exist node_modules (
    echo.
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Failed to install dependencies
        pause
        exit /b 1
    )
    echo Dependencies installed successfully
) else (
    echo Dependencies already installed
)

REM Ask if user wants to seed database
echo.
set /p SEED="Do you want to seed the database with sample data? (y/n): "
if /i "%SEED%"=="y" (
    echo.
    echo Seeding database...
    call npm run seed
    if errorlevel 1 (
        echo Failed to seed database
        echo Make sure MongoDB is running and .env is configured correctly
    ) else (
        echo Database seeded successfully
        echo.
        echo Test credentials:
        echo   Username: admin
        echo   Password: admin123
    )
)

echo.
echo ================================================
echo           Setup complete!
echo ================================================
echo.
echo To start the server:
echo   npm start       (production mode)
echo   npm run dev     (development mode with auto-reload)
echo.
echo Then visit: http://localhost:3000
echo.
pause
