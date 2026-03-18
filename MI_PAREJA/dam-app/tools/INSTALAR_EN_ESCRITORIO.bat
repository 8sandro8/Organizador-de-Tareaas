@echo off
TITLE Instalador de Acceso Directo DAM
echo [!] Creando acceso directo en el escritorio de esta maquina...

:: Ejecutar el script de PowerShell que ya tenemos
powershell.exe -ExecutionPolicy Bypass -File "%~dp0CREATE_SHORTCUT.ps1"

echo.
echo [OK] Tienes el icono en el escritorio.
echo Ya puedes cerrar esta ventana.
echo.
pause
