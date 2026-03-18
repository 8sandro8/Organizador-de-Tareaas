@echo off
TITLE Instalador DAM Organizer
echo.
echo [!] Configurando acceso directo en el Escritorio...
echo.

:: Ejecutar el script desde la carpeta dam-app
powershell.exe -ExecutionPolicy Bypass -File "%~dp0dam-app\CREATE_SHORTCUT.ps1"

echo.
echo [OK] Acceso directo 'DAM Organizer' creado.
echo [!] Usa ese icono para abrir la aplicacion siempre.
echo.
pause
