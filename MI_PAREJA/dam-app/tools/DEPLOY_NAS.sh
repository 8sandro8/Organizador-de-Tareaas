#!/bin/bash
# 🚀 DAM Organizer - NAS Deployment Script
# Este script prepara y arranca la app en el NAS de forma permanente.

echo "================================================="
echo "   DESPLEGANDO DAM ORGANIZER EN EL NAS"
echo "================================================="

# 1. Instalar dependencias si es necesario (LIMPIEZA PROFUNDA)
echo "[1/4] Realizando limpieza de dependencias..."
rm -rf server/node_modules client/node_modules 2>/dev/null
rm -f server/package-lock.json client/package-lock.json

echo "[1.1/4] Instalando dependencias limpias..."
(cd server && npm install) || echo "Error en server install"
(cd client && npm install) || echo "Error en client install"

# 2. Construir el Frontend (Producción)
echo "[2/4] Generando build de producción..."
(cd client && npm run build) || echo "Error en build"

# 3. Preparar Backend
echo "[3/4] Configurando Backend..."
(cd server && ./node_modules/.bin/prisma generate) || echo "Error en prisma"

# 4. Lanzar con PM2
echo "[4/4] Iniciando servicios con PM2 (Instancia Pareja)..."
pm2 delete dam-backend-pareja dam-frontend-pareja 2>/dev/null

# Arrancamos usando rutas directas
pm2 start index.js --name dam-backend-pareja --cwd ./server
pm2 start "npm run preview -- --host --port 5174" --name dam-frontend-pareja --cwd ./client

pm2 save

pm2 save

echo "================================================="
echo "   ¡SISTEMA ONLINE EN EL NAS!"
echo "   Accede desde tu iPad a la IP del NAS"
echo "================================================="
