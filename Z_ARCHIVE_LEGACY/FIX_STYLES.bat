@echo off
echo ==================================================
echo   DAM OS - REPARADOR DE ESTILOS
echo ==================================================
echo.
echo [1/3] Borrando cache y modulos antiguos...
cd dam-app\client
rmdir /s /q node_modules
del package-lock.json

echo [2/3] Reinstalando dependencias limpias...
call npm install
call npm install -D tailwindcss@3.4.17 postcss@8.4.35 autoprefixer@10.4.17

echo [3/3] Listo. Cierra esto y abre OPEN_DAM_APP.bat
pause
