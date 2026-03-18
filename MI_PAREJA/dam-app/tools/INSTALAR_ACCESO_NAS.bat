@echo off
TITLE Instalador de Acceso NAS (PAREJA) - DAM Organizer
echo =================================================
echo   INSTALADOR DE ACCESO DIRECTO PAREJA (NAS)
echo =================================================
echo.
echo [!] Esto creara un icono en tu escritorio que
echo     conecta con el NAS de la PAREJA.
echo.

:: Ejecutar el script de PowerShell
powershell.exe -ExecutionPolicy Bypass -File "%~dp0CREATE_NAS_SHORTCUT_PAREJA.ps1"

echo.
echo [OK] Tienes el icono "DAM NAS PAREJA" en tu escritorio.
echo Ya puedes cerrar esta ventana.
echo.
pause
exit
