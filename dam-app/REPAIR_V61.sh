#!/bin/bash
# =================================================
#    REPARACIÓN DEFINITIVA - FIX NATIVE ARM64
# =================================================
# El log de PM2 nos chivó que Windows estaba pisando los binarios nativos de Vite (Rollup)
# del NAS (Linux ARM64). Vamos a forzar una reinstalación ultra limpia antes de arrancar.

# Asegurar que el entorno PATH incluya las rutas comunes de Node/npm/npx en Synology NAS
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/local/node/bin:$PATH"

echo "🛑 Deteniendo PM2 e hilos huérfanos..."
pm2 delete all 2>/dev/null
sleep 2

echo "🧨 Liberando puertos bloqueados..."
fuser -k 3015/tcp 3016/tcp 5173/tcp 5174/tcp 2>/dev/null
sleep 1

BASE_DIR="/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE"

# --- 1. SANDRO ---
echo "🚀 Arrancando Instancia SANDRO..."
echo "🧹 Limpiando node_modules de Sandro Server e instalando Prisma nativo..."
cd "$BASE_DIR/dam-app/server"
rm -rf node_modules package-lock.json || true
npm install
npm run generate
npm run db:push
pm2 start index.js --name "dam-backend" --watch false

echo "🧹 Limpiando node_modules de Sandro Client e instalando y compilando para Producción..."
cd "$BASE_DIR/dam-app/client"
rm -rf node_modules package-lock.json || true
npm install --force
npm run build

# --- 2. PAREJA ---
echo "🚀 Arrancando Instancia PAREJA..."
PAREJA_DIR="$BASE_DIR/MI_PAREJA/dam-app"
if [ -d "$PAREJA_DIR" ]; then
    echo "🧹 Limpiando node_modules de Pareja Server e instalando Prisma nativo..."
    cd "$PAREJA_DIR/server"
    rm -rf node_modules package-lock.json || true
    npm install
    npm run generate
    export DATABASE_URL="file:$PAREJA_DIR/server/prisma/dev.db"
    npm run db:push
    pm2 start index.js --name "dam-backend-pareja" --watch false
    
    echo "🧹 Limpiando node_modules de Pareja Client e instalando y compilando para Producción..."
    cd "$PAREJA_DIR/client"
    rm -rf node_modules package-lock.json || true
    npm install --force
    npm run build
fi

pm2 save
echo "================================================="
echo "✅ TODO REINICIADO"
echo "================================================="
pm2 status