@echo off
title DAM Launcher
echo ==================================================
echo   DAM OS - INICIANDO SISTEMA
echo ==================================================
echo.

echo [1/3] Arrancando Backend (Server)...
start "DAM Backend" /min cmd /k "cd dam-app\server && node index.js"

echo [2/3] Arrancando Frontend (Cliente)...
start "DAM Frontend" /min cmd /k "cd dam-app\client && npm run dev"

echo [3/3] Esperando a que carguen los servicios...
timeout /t 5 >nul

echo [INFO] Abriendo navegador...
start http://localhost:5173

echo.
echo ==================================================
echo   SISTEMA OPERATIVO DAM: ONLINE
echo ==================================================
echo.
echo Puedes minimizar esta ventana, pero NO la cierres mientras uses la app.
pause
