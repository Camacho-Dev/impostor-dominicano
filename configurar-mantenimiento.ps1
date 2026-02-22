# Script para configurar el modo mantenimiento automaticamente
# Ejecuta: .\configurar-mantenimiento.ps1 -Token "ghp_tu_token_aqui"

param(
    [Parameter(Mandatory=$true)]
    [string]$Token,
    [string]$AdminKey = "admin-" + (-join ((65..90) + (97..122) | Get-Random -Count 8 | ForEach-Object {[char]$_}))
)

$ErrorActionPreference = "Stop"

Write-Host "=== Configurando Modo Mantenimiento ===" -ForegroundColor Cyan

# 1. Crear el Gist
$gistBody = @{
    public = $true
    files = @{
        "maintenance.json" = @{
            content = @"
{
  "activo": false,
  "mensaje": "Estamos mejorando el juego. Vuelve pronto!"
}
"@
        }
    }
} | ConvertTo-Json -Depth 5

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/gists" -Method Post `
        -Body $gistBody -ContentType "application/json; charset=utf-8" `
        -Headers @{
            Accept = "application/vnd.github.v3+json"
            Authorization = "token $Token"
        }
    $gistId = $response.id
    Write-Host "OK Gist creado: $gistId" -ForegroundColor Green
} catch {
    Write-Host "Error al crear Gist:" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.ErrorDetails.Message) { Write-Host $_.ErrorDetails.Message }
    exit 1
}

# 2. Crear/actualizar .env
$envContent = @"
# Configuracion de Mantenimiento (generado por configurar-mantenimiento.ps1)
VITE_GIST_ID=$gistId
VITE_ADMIN_KEY=$AdminKey
"@

$envPath = Join-Path $PSScriptRoot ".env"
$envContent | Out-File -FilePath $envPath -Encoding utf8 -Force
Write-Host "OK Archivo .env creado" -ForegroundColor Green

# 3. Mostrar resumen
Write-Host ""
Write-Host "=== Configuracion completada ===" -ForegroundColor Green
Write-Host ""
Write-Host "Tu URL del panel admin (guarda esta URL, solo tu la conoces):" -ForegroundColor Yellow
$baseUrl = "https://Camacho-Dev.github.io/impostor-dominicano"
$adminUrl = "$baseUrl/?admin=$AdminKey"
Write-Host "  $adminUrl" -ForegroundColor White
Write-Host ""
Write-Host "Clave admin: $AdminKey" -ForegroundColor Gray
Write-Host ""
Write-Host "Para activar mantenimiento:" -ForegroundColor Cyan
Write-Host "  1. Visita la URL de arriba"
Write-Host "  2. Activa el checkbox y escribe tu mensaje"
Write-Host "  3. Pega tu GitHub Token (el mismo que usaste) y guarda"
Write-Host ""
Write-Host "Vuelve a compilar/desplegar para que los cambios surtan efecto." -ForegroundColor Gray
