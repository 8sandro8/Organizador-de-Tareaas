@echo off
TITLE DAM Manager Launcher
:: Esto asegura que la terminal sepa que estamos en ESTA carpeta
cd /d "%~dp0"

echo ==========================================
echo 🚀 Iniciando DAM Manager Pro...
echo ==========================================
echo.
echo No cierres esta ventana negra mientras uses la web.
echo Si la cierras, la web dejara de funcionar.
echo.

:: Ejecutamos la app usando el módulo de python
python -m streamlit run app.py

:: Si hay algún error, paramos para que puedas leerlo
if %errorlevel% neq 0 pause