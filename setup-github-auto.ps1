# Script automático para configurar GitHub
Write-Host "🚀 Configurando GitHub automáticamente..." -ForegroundColor Green
Write-Host ""

# Intentar obtener username de git config
$username = git config user.name
if ([string]::IsNullOrEmpty($username)) {
    Write-Host "⚠️  No se encontró nombre de usuario en git config" -ForegroundColor Yellow
    Write-Host "Por favor, crea el repositorio manualmente en GitHub y luego ejecuta:" -ForegroundColor Cyan
    Write-Host "   .\subir-github.ps1" -ForegroundColor White
    exit 1
}

Write-Host "✅ Usuario detectado: $username" -ForegroundColor Green
Write-Host ""

# Verificar si ya existe un remote
$remoteCheck = git remote get-url origin 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Ya existe un remote configurado" -ForegroundColor Green
    Write-Host "   Remote actual: $remoteCheck" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "¿Deseas subir el código ahora? (S/N): " -NoNewline -ForegroundColor Yellow
    $respuesta = Read-Host
    if ($respuesta -eq "S" -or $respuesta -eq "s") {
        git push -u origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
            Write-Host "1. Ve a tu repositorio en GitHub" -ForegroundColor White
            Write-Host "2. Settings - Pages - Source: GitHub Actions" -ForegroundColor White
            Write-Host "3. Espera 2-3 minutos para el deployment" -ForegroundColor White
        }
        exit 0
    } else {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit 0
    }
}

# Si no hay remote, pedir al usuario que cree el repositorio
Write-Host "📝 Para continuar, necesitas crear el repositorio en GitHub:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre del repositorio: impostor-dominicano" -ForegroundColor White
Write-Host "3. Visibilidad: Público" -ForegroundColor White
Write-Host "4. NO marques: README, .gitignore, ni license" -ForegroundColor White
Write-Host "5. Click en 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Luego, pega la URL del repositorio aquí:" -ForegroundColor Yellow
Write-Host "Ejemplo: https://github.com/$username/impostor-dominicano.git" -ForegroundColor Gray
Write-Host ""
$repoUrl = Read-Host "URL del repositorio"

if ([string]::IsNullOrEmpty($repoUrl)) {
    Write-Host "❌ No se proporcionó URL. Saliendo..." -ForegroundColor Red
    exit 1
}

# Agregar remote y subir
Write-Host ""
Write-Host "📤 Configurando remote y subiendo código..." -ForegroundColor Cyan
git remote add origin $repoUrl
git branch -M main

Write-Host "Subiendo código..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
    Write-Host ""
    
    # Extraer username del URL
    if ($repoUrl -match 'github\.com/([^/]+)') {
        $githubUser = $matches[1]
        $pagesUrl = "https://$githubUser.github.io/impostor-dominicano/"
        
        Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
        Write-Host "1. Ve a: $repoUrl" -ForegroundColor White
        Write-Host "2. Settings - Pages - Source: GitHub Actions" -ForegroundColor White
        Write-Host "3. Espera 2-3 minutos para el deployment" -ForegroundColor White
        Write-Host "4. Tu app estará en: $pagesUrl" -ForegroundColor Cyan
        Write-Host ""
        
        # Actualizar capacitor.config.json
        Write-Host "🔧 Actualizando capacitor.config.json..." -ForegroundColor Cyan
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
    }
} else {
    Write-Host ""
    Write-Host "❌ Error al subir. Verifica:" -ForegroundColor Red
    Write-Host "- Que el repositorio exista en GitHub" -ForegroundColor White
    Write-Host "- Que tengas permisos para escribir" -ForegroundColor White
    Write-Host "- Que estés autenticado" -ForegroundColor White
}
