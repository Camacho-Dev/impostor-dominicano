# Script para crear repositorio en GitHub y subir el código
# Requiere: Token de acceso personal de GitHub (opcional, pero recomendado)

param(
    [string]$GitHubToken = "",
    [string]$RepoName = "impostor-dominicano",
    [string]$Username = ""
)

Write-Host "🚀 Configurando repositorio en GitHub..." -ForegroundColor Green
Write-Host ""

# Si no hay token, intentar obtenerlo de variables de entorno
if ([string]::IsNullOrEmpty($GitHubToken)) {
    $GitHubToken = $env:GITHUB_TOKEN
}

# Si no hay username, intentar obtenerlo de git config
if ([string]::IsNullOrEmpty($Username)) {
    $Username = git config user.name
    if ([string]::IsNullOrEmpty($Username)) {
        Write-Host "❌ No se encontró nombre de usuario. Configurando..." -ForegroundColor Yellow
        Write-Host "Ingresa tu nombre de usuario de GitHub: " -NoNewline -ForegroundColor Cyan
        $Username = Read-Host
    }
}

# Si hay token, crear el repositorio automáticamente
if (-not [string]::IsNullOrEmpty($GitHubToken)) {
    Write-Host "📦 Creando repositorio en GitHub..." -ForegroundColor Cyan
    
    $headers = @{
        "Authorization" = "token $GitHubToken"
        "Accept" = "application/vnd.github.v3+json"
    }
    
    $body = @{
        name = $RepoName
        description = "Juego del Impostor con palabras dominicanas"
        private = $false
        auto_init = $false
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
        
        Write-Host "✅ Repositorio creado exitosamente!" -ForegroundColor Green
        Write-Host "   URL: $($response.html_url)" -ForegroundColor Cyan
        
        # Agregar remote y subir
        $repoUrl = $response.clone_url
        git remote remove origin 2>$null
        git remote add origin $repoUrl
        git branch -M main
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ ¡Código subido exitosamente!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
            Write-Host "1. Ve a: $($response.html_url)" -ForegroundColor White
            Write-Host "2. Settings > Pages > Source: GitHub Actions" -ForegroundColor White
            Write-Host "3. Tu app estará en: https://$Username.github.io/$RepoName/" -ForegroundColor Cyan
            Write-Host ""
            
            # Actualizar capacitor.config.json
            Write-Host "🔧 Actualizando capacitor.config.json..." -ForegroundColor Cyan
            $capacitorConfig = Get-Content "capacitor.config.json" | ConvertFrom-Json
            $capacitorConfig.server = @{
                androidScheme = "https"
                url = "https://$Username.github.io/$RepoName/"
                cleartext = $false
            }
            $capacitorConfig | ConvertTo-Json -Depth 10 | Set-Content "capacitor.config.json"
            Write-Host "✅ capacitor.config.json actualizado!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📦 Ahora ejecuta:" -ForegroundColor Yellow
            Write-Host "   npm run build" -ForegroundColor White
            Write-Host "   npx cap sync android" -ForegroundColor White
        }
    } catch {
        Write-Host "❌ Error al crear repositorio: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
        Write-Host "💡 Usando método manual..." -ForegroundColor Yellow
        & ".\subir-github.ps1"
    }
} else {
    Write-Host "⚠️  No se encontró token de GitHub. Usando método manual..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Para crear el repositorio automáticamente:" -ForegroundColor Cyan
    Write-Host "1. Ve a https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Genera un token con permisos 'repo'" -ForegroundColor White
    Write-Host "3. Ejecuta: .\crear-repo-github.ps1 -GitHubToken TU_TOKEN" -ForegroundColor White
    Write-Host ""
    Write-Host "O sigue las instrucciones en CREAR-REPOSITORIO.md" -ForegroundColor Cyan
    Write-Host ""
    
    # Ejecutar script manual
    & ".\subir-github.ps1"
}

