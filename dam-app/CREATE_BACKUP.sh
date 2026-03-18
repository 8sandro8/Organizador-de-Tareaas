#!/bin/bash

# ==========================================
# 🛡️ SCRIPT DE BACKUP - DAM APP
# ==========================================
# Este script crea un archivo .tar.gz con el estado actual del proyecto
# excluyendo carpetas pesadas como node_modules para ahorrar espacio.

echo "========================================="
echo "🛠️ INICIANDO PUNTO DE RESTAURACIÓN..."
echo "========================================="

# Directorio del proyecto y nombre del backup
PROJECT_DIR="/volume1/homes/Sandro/GRADO SUPERIOR/PENDIENTE/dam-app"
BACKUP_DIR="${PROJECT_DIR}/backups"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILENAME="dam-app-backup_${TIMESTAMP}.tar.gz"

# Crear carpeta de backups si no existe
mkdir -p "${BACKUP_DIR}"

# Vamos al directorio padre para comprimir la carpeta entera limpiamente
cd "${PROJECT_DIR}/.."

echo "⏳ Comprimiendo archivos (ignorando node_modules y bases de datos innecesarias)..."

# Comprimir la carpeta del proyecto excluyendo node_modules
tar -czvf "${BACKUP_DIR}/${BACKUP_FILENAME}" \
    --exclude="dam-app/node_modules" \
    --exclude="dam-app/client/node_modules" \
    --exclude="dam-app/server/node_modules" \
    --exclude="MI_PAREJA/dam-app/node_modules" \
    --exclude="MI_PAREJA/dam-app/client/node_modules" \
    --exclude="MI_PAREJA/dam-app/server/node_modules" \
    --exclude="dam-app/backups" \
    dam-app MI_PAREJA

echo "✅ Copia de seguridad creada con éxito!"
echo "📂 Guardada en: ${BACKUP_DIR}/${BACKUP_FILENAME}"
echo "========================================="
echo "💡 Si algo se rompe, puedes descomprimir este archivo para volver a este punto exacto."
