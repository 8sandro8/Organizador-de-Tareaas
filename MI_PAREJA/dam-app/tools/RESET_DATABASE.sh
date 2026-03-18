#!/bin/bash
echo "============================================================="
echo "   DAM Organizer - RESET DATABASE (SH)"
echo "============================================================="
echo ""
echo "ADVERTENCIA: Vas a ELIMINAR todos los datos actuales."
echo "Este script restaurará la base de datos a su estado inicial."
echo ""
read -p "¿Estás seguro? (s/n): " confirm

if [[ $confirm != "s" && $confirm != "S" ]]; then
    echo "Operación cancelada."
    exit 0
fi

echo ""
echo "[1/2] Eliminando base de datos actual..."
if [ -f "server/prisma/dev.db" ]; then
    rm "server/prisma/dev.db"
fi

echo "[2/2] Re-inicializando esquema y semillas..."
cd server
npx prisma db push --accept-data-loss
node seed.js
cd ..

echo ""
echo "[OK] Base de datos restaurada correctamente."
echo "Ya puedes iniciar la app con ./FULL_LAUNCH.sh"
echo ""
