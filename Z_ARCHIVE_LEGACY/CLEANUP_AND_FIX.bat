@echo off
TITLE DAM Organizer - GLOBAL CLEANUP & FIX
echo.
echo [!] Iniciando LIMPIEZA Y REPARACION GLOBAL...
echo.

:: --- PROYECTO PERSONAL ---
echo [+] Procesando: dam-app...
cd /d "s:\SynologyDrive\GRADO SUPERIOR\PENDIENTE\dam-app"

echo [1/4] Configurando .env...
echo DATABASE_URL="file:./prisma/dev.db" > server\.env
echo PORT=3015 >> server\.env

echo [2/4] Inicializando Base de Datos...
cd server
call npx prisma db push --accept-data-loss
call node seed.js
cd ..

echo [3/4] Eliminando archivos redundantes...
if exist "server\checkDB.js" del "server\checkDB.js"
if exist "server\check_count.js" del "server\check_count.js"
if exist "server\countCheck.js" del "server\countCheck.js"
if exist "server\debug_log.txt" del "server\debug_log.txt"
if exist "server\debug_restore.txt" del "server\debug_restore.txt"
if exist "server\schema_check.txt" del "server\schema_check.txt"
if exist "server\sync_log.txt" del "server\sync_log.txt"
if exist "server\node_modules_SANDRO_feb.-22-212330-2026_conflict_parent" rd /s /q "server\node_modules_SANDRO_feb.-22-212330-2026_conflict_parent"

:: --- PROYECTO PAREJA ---
echo.
echo [+] Procesando: MI_PAREJA\dam-app...
cd /d "s:\SynologyDrive\GRADO SUPERIOR\PENDIENTE\MI_PAREJA\dam-app"

echo [1/4] Configurando .env...
echo DATABASE_URL="file:./prisma/dev.db" > server\.env
echo PORT=3015 >> server\.env

echo [2/4] Inicializando Base de Datos...
cd server
call npx prisma db push --accept-data-loss
call node seed.js
cd ..

echo [3/4] Eliminando archivos redundantes...
if exist "server\checkDB.js" del "server\checkDB.js"
if exist "server\check_count.js" del "server\check_count.js"
if exist "server\countCheck.js" del "server\countCheck.js"
if exist "server\debug_log.txt" del "server\debug_log.txt"
if exist "server\debug_restore.txt" del "server\debug_restore.txt"
if exist "server\schema_check.txt" del "server\schema_check.txt"
if exist "server\sync_log.txt" del "server\sync_log.txt"

echo.
echo [OK] Limpieza y Reparacion completada.
echo.
pause
exit
