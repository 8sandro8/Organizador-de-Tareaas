@echo off
TITLE DAM Organizer - RESET DATABASE
echo.
echo  =============================================================
echo    ADVERTENCIA: Vas a ELIMINAR todos los datos actuales.
echo    Este script restaurara la base de datos a su estado inicial.
echo  =============================================================
echo.
set /p confirm="¿Estas seguro? (S/N): "
if /i "%confirm%" neq "S" goto cancel

echo.
echo [1/2] Eliminando base de datos actual...
if exist "server\prisma\dev.db" del "server\prisma\dev.db"

echo [2/2] Re-inicializando esquema y semillas...
cd server
call npx prisma db push --accept-data-loss
call node seed.js
cd ..

echo.
echo [OK] Base de datos restaurada correctamente.
echo Ya puedes iniciar la app con FULL_LAUNCH.bat
echo.
pause
exit

:cancel
echo Operacion cancelada.
pause
