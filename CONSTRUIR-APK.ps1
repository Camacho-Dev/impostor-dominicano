# Script para construir la APK
Write-Host "🚀 Construyendo APK..." -ForegroundColor Green

# Verificar que los archivos estén copiados
Write-Host "📋 Verificando archivos..." -ForegroundColor Yellow
if (Test-Path "android\app\src\main\assets\public\index.html") {
    Write-Host "✅ Archivos web encontrados" -ForegroundColor Green
} else {
    Write-Host "❌ Archivos web no encontrados. Copiando..." -ForegroundColor Red
    Copy-Item -Path "dist\*" -Destination "android\app\src\main\assets\public\" -Recurse -Force
    Write-Host "✅ Archivos copiados" -ForegroundColor Green
}

# Verificar versionCode
Write-Host "📱 Verificando versión..." -ForegroundColor Yellow
$buildGradle = Get-Content "android\app\build.gradle" -Raw
if ($buildGradle -match "versionCode (\d+)") {
    $versionCode = [int]$matches[1]
    Write-Host "✅ VersionCode: $versionCode" -ForegroundColor Green
} else {
    Write-Host "❌ No se encontró versionCode" -ForegroundColor Red
}

Write-Host ""
Write-Host "📝 SIGUIENTE PASO:" -ForegroundColor Cyan
Write-Host "1. Abre Android Studio" -ForegroundColor White
Write-Host "2. Abre el proyecto: $PWD\android" -ForegroundColor White
Write-Host "3. Ve a: Build → Clean Project" -ForegroundColor White
Write-Host "4. Ve a: Build → Rebuild Project" -ForegroundColor White
Write-Host "5. Ve a: Build → Build Bundle(s) / APK(s) → Build APK(s)" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANTE: Desinstala la app anterior antes de instalar la nueva APK" -ForegroundColor Yellow
Write-Host ""

