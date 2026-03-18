@echo off
SETLOCAL EnableExtensions
TITLE DAM Organizer - Portal Sistema
echo [!] Iniciando SISTEMA DASHBOARD DAM (Modo Portable)...

:: Detectar ruta actual
SET "BASE_DIR=%~dp0"
pushd "%BASE_DIR%"

:: Verificar si existe la carpeta server y client
:: Verificar si existe la carpeta server y client
if not exist "server" (
    echo [ERROR] No se encuentra la carpeta 'server'. Ejecuta este script desde la raiz de 'dam-app'.
    pause
    exit /b
)

:: Crear Backup automatico antes de arrancar
echo [0/3] Asegurando Base de Datos (Backup)...
start /B /D "server" cmd /c "npm run backup"
timeout /t 2 /nobreak > nul

:: Importar MD automatico
echo [1/3] Sincronizando datos (MD Importer)...
start /B /D "server" cmd /c "npm run import-md"
timeout /t 3 /nobreak > nul

:: Abrir Backend
echo [2/3] Arrancando Nucleo (Backend)...
start "DAM BACKEND" /D "server" cmd /c "node index.js"

:: Abrir Frontend
echo [3/3] Arrancando Interfaz (Frontend)...
start "DAM FRONTEND" /D "client" cmd /c "npm run dev"

echo [!] Esperando a que los servicios esten listos...
timeout /t 5 /nobreak > nul

:: Abrir el navegador
echo [!] Accediendo al sistema...
start http://localhost:5173

echo.
echo [OK] Sistema en ejecucion en esta maquina.
echo.
echo TIP: Si estas en un ordenador nuevo, recuerda tener Node.js instalado.
echo.
pause
