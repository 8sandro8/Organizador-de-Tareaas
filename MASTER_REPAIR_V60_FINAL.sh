#!/bin/bash
# 🛡️ DAM Organizer - ULTIMATE REPAIR V60 (FIXED PATHS)
# Este script usa las rutas reales detectadas en tu terminal del NAS.

echo "================================================="
echo "   REPARACIÓN MAESTRA DEL KERNEL - v6.0 GOLD"
echo "================================================="

# 0. Definir ruta base (basada en tu terminal)
BASE_PATH="/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE"

# 1. Limpiar procesos fantasma
echo "[1/5] Liberando puertos 3015 y 3016..."
pm2 delete all 2>/dev/null
fuser -k 3015/tcp 2>/dev/null
fuser -k 3016/tcp 2>/dev/null

# 2. Ajustar permisos de Base de Datos
echo "[2/5] Corrigiendo permisos de DB..."
chmod -R 777 "$BASE_PATH/dam-app/server/prisma" 2>/dev/null
chmod -R 777 "$BASE_PATH/MI_PAREJA/dam-app/server/prisma" 2>/dev/null

# 3. Regenerar Prisma Client (Fundamental para evitar crashes silenciosos)
echo "[3/5] Regenerando Prisma Client..."
cd "$BASE_PATH/dam-app/server" && ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma
cd "$BASE_PATH/MI_PAREJA/dam-app/server" && ./node_modules/.bin/prisma generate --schema=./prisma/schema.prisma

# 4. Lanzar instancias v6.0 GOLD
echo "[4/5] Lanzando Servicios..."

# Sandro
cd "$BASE_PATH/dam-app/server"
pm2 start index.js --name "dam-backend" --watch false
cd ../client
pm2 start npm --name "dam-frontend" -- run dev -- --host 0.0.0.0 --port 5173

# Pareja
cd "$BASE_PATH/MI_PAREJA/dam-app/server"
pm2 start index.js --name "dam-backend-pareja" --watch false
cd ../client
pm2 start npm --name "dam-frontend-pareja" -- run dev -- --host 0.0.0.0 --port 5174

# 5. Verificación
echo "[5/5] Finalizando..."
pm2 save
pm2 status

echo "================================================="
echo "   SISTEMA RESTABLECIDO CON RUTAS FIJAS"
echo "   Prueba ahora los logs: pm2 logs dam-backend"
echo "================================================="
