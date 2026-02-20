# Script para subir el proyecto a GitHub
# Ejecuta este script después de crear el repositorio en GitHub

Write-Host "🚀 Subiendo proyecto a GitHub..." -ForegroundColor Green
Write-Host ""

# Verificar si ya existe un remote
$remoteCheck = git remote get-url origin 2>&1
$hasRemote = $LASTEXITCODE -eq 0

if ($hasRemote) {
    Write-Host "✅ Ya existe un remote 'origin'" -ForegroundColor Yellow
    Write-Host "   URL actual: $remoteCheck" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "¿Deseas cambiarlo? (S/N): " -NoNewline -ForegroundColor Yellow
    $respuesta = Read-Host
    if ($respuesta -eq "S" -or $respuesta -eq "s") {
        Write-Host ""
        Write-Host "Ingresa la URL de tu repositorio de GitHub:" -ForegroundColor Cyan
        Write-Host "Ejemplo: https://github.com/TU-USUARIO/impostor-dominicano.git" -ForegroundColor Gray
        $repoUrl = Read-Host
        if ($repoUrl) {
            git remote set-url origin $repoUrl
            Write-Host "✅ Remote actualizado" -ForegroundColor Green
        }
    } else {
        Write-Host "Usando remote existente..." -ForegroundColor Gray
    }
} else {
    Write-Host "📝 Ingresa la URL de tu repositorio de GitHub:" -ForegroundColor Cyan
    Write-Host "Ejemplo: https://github.com/TU-USUARIO/impostor-dominicano.git" -ForegroundColor Gray
    Write-Host ""
    $repoUrl = Read-Host
    
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "✅ Remote agregado: $repoUrl" -ForegroundColor Green
    } else {
        Write-Host "❌ No se proporcionó URL. Saliendo..." -ForegroundColor Red
        exit 1
    }
}

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
Write-Host "📤 Subiendo código a GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Proyecto subido exitosamente a GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "1. Ve a tu repositorio en GitHub" -ForegroundColor White
    Write-Host "2. Settings - Pages" -ForegroundColor White
    Write-Host "3. Source: GitHub Actions" -ForegroundColor White
    Write-Host "4. Espera a que se complete el deployment" -ForegroundColor White
    Write-Host "5. Tu app estará en: https://TU-USUARIO.github.io/impostor-dominicano/" -ForegroundColor Cyan
    Write-Host ""
    
    # Intentar extraer username y actualizar capacitor.config.json
    $currentRemote = git remote get-url origin 2>&1
    if ($currentRemote -match 'github\.com/([^/]+)') {
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
            Write-Host "⚠️  No se pudo actualizar capacitor.config.json automáticamente" -ForegroundColor Yellow
            Write-Host "   Actualízalo manualmente con la URL: $pagesUrl" -ForegroundColor Gray
        }
    }
} else {
    Write-Host ""
    Write-Host "❌ Error al subir. Verifica:" -ForegroundColor Red
    Write-Host "- Que el repositorio exista en GitHub" -ForegroundColor White
    Write-Host "- Que tengas permisos para escribir" -ForegroundColor White
    Write-Host "- Que estés autenticado" -ForegroundColor White
    Write-Host ""
    Write-Host "Para autenticarte, ejecuta:" -ForegroundColor Yellow
    $authCmd = 'git config --global credential.helper store'
    Write-Host "   $authCmd" -ForegroundColor White
    Write-Host ""
}
