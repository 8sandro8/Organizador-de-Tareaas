@echo off
TITLE Lanzador DAM Portatil

:: Usamos pushd con TU ruta real para entrar en la carpeta
pushd "C:\Users\Sandro\SynologyDrive\GRADO SUPERIOR\PENDIENTE"

echo Iniciando sistema...
python -m streamlit run app.py

:: Si hay error, pausa para leerlo
if %errorlevel% neq 0 pause

:: Desconectar unidad temporal al salir
popd