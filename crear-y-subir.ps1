# Script para crear repositorio y subir código automáticamente
param(
    [string]$GitHubToken = "",
    [string]$RepoUrl = ""
)

Write-Host "🚀 Creando repositorio y subiendo código..." -ForegroundColor Green
Write-Host ""

$username = git config user.name
if ([string]::IsNullOrEmpty($username)) {
    Write-Host "❌ No se encontró nombre de usuario en git config" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Usuario: $username" -ForegroundColor Green
Write-Host ""

# Si se proporcionó URL, usarla directamente
if (-not [string]::IsNullOrEmpty($RepoUrl)) {
    Write-Host "📤 Usando URL proporcionada: $RepoUrl" -ForegroundColor Cyan
    git remote add origin $RepoUrl 2>$null
    if ($LASTEXITCODE -ne 0) {
        git remote set-url origin $RepoUrl
    }
    git branch -M main
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
        if ($RepoUrl -match 'github\.com/([^/]+)') {
            $githubUser = $matches[1]
            $pagesUrl = "https://$githubUser.github.io/impostor-dominicano/"
            Write-Host "📋 Tu app estará en: $pagesUrl" -ForegroundColor Cyan
        }
    }
    exit 0
}

# Si se proporcionó token, intentar crear el repositorio
if (-not [string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "📦 Creando repositorio en GitHub..." -ForegroundColor Cyan
    
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $body = @{
        name = "impostor-dominicano"
        description = "Juego del Impostor con palabras dominicanas"
        private = $false
        auto_init = $false
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        
        Write-Host "✅ Repositorio creado: $($response.html_url)" -ForegroundColor Green
        
        $repoUrl = $response.clone_url
        git remote add origin $repoUrl
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
            Write-Host "1. Ve a: $($response.html_url)" -ForegroundColor White
            Write-Host "2. Settings - Pages - Source: GitHub Actions" -ForegroundColor White
            Write-Host "3. Tu app estará en: https://$username.github.io/impostor-dominicano/" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "❌ Error al crear repositorio: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Crea el repositorio manualmente y ejecuta:" -ForegroundColor Yellow
        Write-Host "   .\crear-y-subir.ps1 -RepoUrl https://github.com/$username/impostor-dominicano.git" -ForegroundColor White
    }
    exit 0
}

# Si no hay token ni URL, mostrar instrucciones
Write-Host "📝 Para continuar, necesitas crear el repositorio en GitHub:" -ForegroundColor Cyan
Write-Host ""
Write-Host "OPCIÓN 1 - Manual (Recomendado):" -ForegroundColor Yellow
Write-Host "1. Ve a: https://github.com/new" -ForegroundColor White
Write-Host "2. Nombre: impostor-dominicano" -ForegroundColor White
Write-Host "3. Público" -ForegroundColor White
Write-Host "4. NO marques README, .gitignore, ni license" -ForegroundColor White
Write-Host "5. Click en 'Create repository'" -ForegroundColor White
Write-Host ""
Write-Host "Luego ejecuta:" -ForegroundColor Yellow
Write-Host "   .\crear-y-subir.ps1 -RepoUrl https://github.com/TU-USUARIO/impostor-dominicano.git" -ForegroundColor White
Write-Host ""
Write-Host "OPCIÓN 2 - Con Token (Automático):" -ForegroundColor Yellow
Write-Host "1. Obtén un token: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Ejecuta: .\crear-y-subir.ps1 -GitHubToken TU_TOKEN" -ForegroundColor White
Write-Host ""



