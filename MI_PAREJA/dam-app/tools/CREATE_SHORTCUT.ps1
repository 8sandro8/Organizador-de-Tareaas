$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [Environment]::GetFolderPath('Desktop')
$Shortcut = $WshShell.CreateShortcut("$DesktopPath\DAM Organizer.lnk")

# Usar $PSScriptRoot para que funcione en cualquier carpeta/equipo
$CurrentDir = $PSScriptRoot
if (-not $CurrentDir) { $CurrentDir = Get-Location }

$Shortcut.TargetPath = "cmd.exe"
$Shortcut.Arguments = "/c ""$CurrentDir\FULL_LAUNCH.bat"""
$Shortcut.WorkingDirectory = "$CurrentDir"
$Shortcut.IconLocation = "imageres.dll, 243" # Un icono de terminal/sistema
$Shortcut.Description = "Lanzador de Dashboard DAM"
$Shortcut.Save()

Write-Host "[OK] Acceso directo 'DAM Organizer' creado en el escritorio." -ForegroundColor Green
Write-Host "[!] Si Windows pide permisos, dale a 'Ejecutar de todas formas'." -ForegroundColor Yellow
