$DesktopPath = [Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "ENTRAR_AL_DAM_NAS_PAREJA.bat"

# IP de Tailscale del NAS
$NAS_IP = "100.72.183.18"
$URL = "http://$NAS_IP:5174"

# Crear el contenido del archivo .bat
$Content = "@echo off`r`nstart """" ""$URL""`r`nexit"

# Guardar el archivo
$Content | Out-File -FilePath $ShortcutPath -Encoding ascii

Write-Host "[OK] Acceso directo 'ENTRAR_AL_DAM_NAS_PAREJA.bat' creado en el escritorio." -ForegroundColor Green
Write-Host "[!] Apunta a: $URL" -ForegroundColor Cyan
