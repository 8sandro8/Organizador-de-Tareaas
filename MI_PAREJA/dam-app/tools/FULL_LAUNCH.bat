@echo off
SETLOCAL EnableExtensions
TITLE DAM Organizer v4.0 - LANZADOR MAESTRO
echo.
echo  =============================================================
echo    SISTEMA DASHBOARD DAM v4.0 - @Antigravity
echo  =============================================================
echo.

:: Detectar ruta actual
SET "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

:: 1. Verificar dependencias criticas
if not exist "server\node_modules" (
    echo [!] Detectado entorno nuevo. Instalando dependencias del Servidor...
    cd server && call npm install && cd ..
)
if not exist "client\node_modules" (
    echo [!] Detectado entorno nuevo. Instalando dependencias de la Interfaz...
    cd client && call npm install && cd ..
)

:: 2. Backup y Sincronizacion
echo [1/3] Sincronizando datos y Backups...
start "DAM BACKUP" /min /D "server" cmd /c "npm run backup && npm run import-md"
timeout /t 3 /nobreak > nul

:: 3. Arrancar Backend
echo [2/3] Iniciando Nucleo (Backend)...
:: Quitamos /min para que el usuario vea si hay un error de puerto u otro
start "DAM BACKEND" /D "server" cmd /c "node index.js"
timeout /t 2 /nobreak > nul

:: 4. Arrancar Frontend
echo [3/3] Iniciando Interfaz (Frontend)...
start "DAM FRONTEND" /D "client" cmd /c "npm run dev"

echo.
echo [OK] Servicios arrancados correctamente.
echo [!] Esperando inicializacion final (5s)...
timeout /t 5 /nobreak > nul

echo [!] Abriendo acceso al sistema...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address" ^| findstr /c:"192.168."') do (
    set "LOCAL_IP=%%a"
)
set "LOCAL_IP=%LOCAL_IP: =%"

echo.
echo  =============================================================
echo    INFO DE CONEXION:
echo    - PC LOCAL: http://localhost:5173
echo    - TABLET:   http://%LOCAL_IP%:5173
echo  =============================================================
echo.

start http://localhost:5173

echo.
echo -------------------------------------------------------------
echo  SISTEMA ONLINE. Minimiza estas ventanas pero no las cierres.
echo -------------------------------------------------------------
echo.
pause
