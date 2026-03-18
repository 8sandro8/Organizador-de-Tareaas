#!/bin/bash
echo "============================================================="
echo "   SISTEMA DASHBOARD DAM v4.0 - LANZADOR SH"
echo "============================================================="

# Detectar directorio base
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$BASE_DIR"

# 1. Verificar dependencias
if [ ! -d "server/node_modules" ]; then
    echo "[!] Instalando dependencias del Servidor..."
    (cd server && npm install)
fi
if [ ! -d "client/node_modules" ]; then
    echo "[!] Instalando dependencias de la Interfaz..."
    (cd client && npm install)
fi

# 2. Arrancar Backend
echo "[1/2] Iniciando Nucleo (Backend)..."
(cd server && node index.js) &

# 3. Arrancar Frontend
echo "[2/2] Iniciando Interfaz (Frontend)..."
(cd client && npm run dev) &

# Detectar IP Local (Intenta varios comandos comunes)
IP=$(hostname -I 2>/dev/null | awk '{print $1}')
if [ -z "$IP" ]; then
    IP=$(ip route get 1.2.3.4 2>/dev/null | awk '{print $7}')
fi
if [ -z "$IP" ]; then
    IP="TU_IP_LOCAL"
fi

echo ""
echo "============================================================="
echo " [OK] SISTEMA ONLINE"
echo "-------------------------------------------------------------"
echo " PC LOCAL: http://localhost:5173"
echo " MOBILE/TABLET: http://$IP:5173"
echo "============================================================="
echo "Presione Ctrl+C para detener todos los servicios."
wait
