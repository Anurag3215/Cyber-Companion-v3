@echo off
title Cyber Companion v3 - Auto Launcher
cd /d "%~dp0"

echo ========================================================
echo   CYBER COMPANION v3 - ZERO-TRUST SENTINEL
echo ========================================================
echo.
echo [1/3] Building TypeScript modules...
call npm run build:api

echo [2/3] Starting Threat Intel API Gateway on port 5000...
start "Cyber Companion API (Port 5000)" cmd /k "npm run start:api"

echo [3/3] Starting Metro Bundler for Expo Go on 192.168.1.15:8081...
cd apps\mobile
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.1.15
start "Cyber Companion Metro (Port 8081)" cmd /k "npx expo start --lan"

echo.
echo ========================================================
echo   ALL SERVICES STARTED!
echo   - API: http://192.168.1.15:5000/v1
echo   - Expo: exp://192.168.1.15:8081
echo ========================================================
pause
