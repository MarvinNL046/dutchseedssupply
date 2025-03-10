@echo off
setlocal enabledelayedexpansion
echo ===================================================
echo Dutch Seed Supply - Cannabis Seeds Demo Data Import
echo ===================================================
echo.
echo This script will insert demo cannabis seed products into your Supabase database.
echo Make sure you have updated the .env file with your Supabase credentials.
echo.
echo Press Ctrl+C to cancel or any key to continue...
pause > nul

echo.
echo Loading environment variables from .env file...
for /f "tokens=*" %%a in (.env) do (
    set line=%%a
    if not "!line:~0,1!"=="#" (
        if not "!line!"=="" (
            set %%a
        )
    )
)

echo.
echo Inserting demo data...
node scripts/insert_demo_data_direct.mjs

echo.
echo Process completed. Check the output above for any errors.
echo.
pause
