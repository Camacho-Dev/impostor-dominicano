# Script para subir a GitHub con URL como parametro
param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host "🚀 Subiendo proyecto a GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar si ya existe un remote
$remoteCheck = git remote get-url origin 2>&1
$hasRemote = $LASTEXITCODE -eq 0

if ($hasRemote) {
    Write-Host "⚠️  Ya existe un remote 'origin'" -ForegroundColor Yellow
    Write-Host "   URL actual: $remoteCheck" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Actualizando a: $RepoUrl" -ForegroundColor Yellow
    git remote set-url origin $RepoUrl
} else {
    Write-Host "📝 Agregando remote: $RepoUrl" -ForegroundColor Cyan
    git remote add origin $RepoUrl
}

Write-Host "✅ Remote configurado" -ForegroundColor Green
Write-Host ""

# Verificar la rama actual
$branch = git branch --show-current 2>&1
if ($LASTEXITCODE -ne 0) {
    $branch = "main"
}

if ($branch -ne "main" -and $branch -ne "master") {
    Write-Host "🔄 Cambiando a rama 'main'..." -ForegroundColor Yellow
    git checkout -b main 2>$null
    if ($LASTEXITCODE -ne 0) {
        git branch -M main
    }
} elseif ($branch -eq "master") {
    Write-Host "🔄 Renombrando rama 'master' a 'main'..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host ""

# Subir a GitHub
Write-Host "📤 Subiendo codigo a GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Proximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Ve a tu repositorio en GitHub" -ForegroundColor White
    Write-Host "2. Settings - Pages - Source: GitHub Actions" -ForegroundColor White
    Write-Host "3. Espera 2-3 minutos para el deployment" -ForegroundColor White
    Write-Host ""
    
    # Intentar extraer username y actualizar capacitor.config.json
    if ($RepoUrl -match 'github\.com/([^/]+)') {
        $githubUser = $matches[1]
        $pagesUrl = "https://$githubUser.github.io/impostor-dominicano/"
        
        Write-Host "🔧 Actualizando capacitor.config.json..." -ForegroundColor Cyan
        try {
            $capacitorConfig = Get-Content "capacitor.config.json" -Raw | ConvertFrom-Json
            $capacitorConfig.server = @{
                androidScheme = "https"
                url = $pagesUrl
                cleartext = $false
            }
            $capacitorConfig | ConvertTo-Json -Depth 10 | Set-Content "capacitor.config.json"
            Write-Host "✅ capacitor.config.json actualizado con: $pagesUrl" -ForegroundColor Green
            Write-Host ""
            Write-Host "📦 Ahora ejecuta:" -ForegroundColor Yellow
            Write-Host "   npm run build" -ForegroundColor White
            Write-Host "   npx cap sync android" -ForegroundColor White
        } catch {
            Write-Host "⚠️  No se pudo actualizar capacitor.config.json automaticamente" -ForegroundColor Yellow
            Write-Host "   Actualizalo manualmente con la URL: $pagesUrl" -ForegroundColor Gray
        }
    }
} else {
    Write-Host ""
    Write-Host "❌ Error al subir. Verifica:" -ForegroundColor Red
    Write-Host "- Que el repositorio exista en GitHub" -ForegroundColor White
    Write-Host "- Que tengas permisos para escribir" -ForegroundColor White
    Write-Host "- Que estes autenticado" -ForegroundColor White
    Write-Host ""
}
