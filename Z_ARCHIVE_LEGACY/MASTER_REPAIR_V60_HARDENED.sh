#!/bin/bash
# 🛡️ DAM Organizer - MASTER REPAIR V60 HARDENED
# Este script soluciona bloqueos de puerto y caídas del Kernel en el NAS.

echo "================================================="
echo "   REPARACIÓN MAESTRA DEL KERNEL - v6.0 GOLD"
echo "================================================="

# 1. Limpiar procesos fantasma en los puertos Backend
echo "[1/4] Liberando puertos 3015 y 3016..."
fuser -k 3015/tcp 2>/dev/null
fuser -k 3016/tcp 2>/dev/null

# 2. Reiniciar PM2 de forma agresiva
echo "[2/4] Reiniciando orquestador PM2..."
pm2 stop all
pm2 delete all

# 3. Lanzar instancias con nueva configuración de monitoreo
echo "[3/4] Lanzando Servicios..."

# Sandro (v6.0 Gold)
cd ~/SynologyDrive/GRADO\ SUPERIOR/PENDIENTE/dam-app/server
pm2 start index.js --name "dam-backend" --watch false
cd ../client
pm2 start npm --name "dam-frontend" -- run dev -- --host 0.0.0.0 --port 5173

# Pareja (v6.0 Gold)
cd ~/SynologyDrive/GRADO\ SUPERIOR/PENDIENTE/MI_PAREJA/dam-app/server
pm2 start index.js --name "dam-backend-pareja" --watch false
cd ../client
pm2 start npm --name "dam-frontend-pareja" -- run dev -- --host 0.0.0.0 --port 5174

# 4. Verificación de Salud
echo "[4/4] Verificando estado final..."
pm2 save
pm2 status

echo "================================================="
echo "   SISTEMA RESTABLECIDO"
echo "   Verfica en el navegador: http://<IP-NAS>:5173"
echo "================================================="
