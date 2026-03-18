@echo off
TITLE DAM Organizer - ACCESO NAS (PAREJA/TAILSCALE)
:: IP de Tailscale de tu NAS
set "NAS_IP=100.72.183.18"

echo [!] Abriendo DAM Organizer (Pareja) desde el NAS (via Tailscale)...
start http://%NAS_IP%:5174
exit
