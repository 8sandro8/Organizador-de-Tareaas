#!/bin/bash
# 🚀 DAM Organizer - Quick Restart Script
# Este script solo reinicia los procesos en PM2 sin reinstalar nada.

echo "================================================="
echo "   REINICIANDO DAM ORGANIZER EN EL NAS"
echo "================================================="

# Detectar en qué carpeta estamos para saber qué procesos reiniciar
if [[ "$PWD" == *"MI_PAREJA"* ]]; then
    echo "[!] Detectada instancia de PAREJA"
    PROCESS_NAME_B="dam-backend-pareja"
    PROCESS_NAME_F="dam-frontend-pareja"
else
    echo "[!] Detectada instancia de SANDRO"
    PROCESS_NAME_B="dam-backend"
    PROCESS_NAME_F="dam-frontend"
fi

echo "[1/2] Reiniciando Backend ($PROCESS_NAME_B)..."
pm2 restart $PROCESS_NAME_B

echo "[2/2] Reiniciando Frontend ($PROCESS_NAME_F)..."
pm2 restart $PROCESS_NAME_F

echo "================================================="
echo "   SISTEMA REINICIADO"
echo "================================================="
pm2 status
