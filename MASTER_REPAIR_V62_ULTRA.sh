#!/bin/bash
BASE_PATH="/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE"
export DATABASE_URL="file:/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE/dam-app/server/prisma/dev.db"
echo "[1/3] Limpiando procesos..."
pm2 delete all 2>/dev/null
echo "[2/3] Verificando Base de Datos..."
ls -lh "$BASE_PATH/dam-app/server/prisma/dev.db"
echo "[3/3] Iniciando Kernel v6.2.2..."
cd "$BASE_PATH/dam-app/server"
pm2 start index.js --name "dam-backend"
cd ../client && pm2 start npm --name "dam-frontend" -- run dev -- --host 0.0.0.0 --port 5173
pm2 status
