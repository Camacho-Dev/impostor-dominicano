# Script para compilar la APK firmada en modo release
# Ejecutar: .\build-release.ps1

Write-Host "Compilando APK firmada en modo Release..." -ForegroundColor Green
Write-Host ""

# Verificar que existe el keystore
$keystorePath = "..\impostor-dominicano.keystore"
if (-not (Test-Path $keystorePath)) {
    Write-Host "ERROR: No se encontro el keystore en: $keystorePath" -ForegroundColor Red
    Write-Host "Ejecuta primero: .\crear-keystore.ps1" -ForegroundColor Yellow
    exit 1
}

# Verificar que existe keystore.properties
$keystoreProps = "keystore.properties"
if (-not (Test-Path $keystoreProps)) {
    Write-Host "ERROR: No se encontro el archivo keystore.properties" -ForegroundColor Red
    exit 1
}

Write-Host "Keystore encontrado: $keystorePath" -ForegroundColor Cyan
Write-Host "Compilando..." -ForegroundColor Yellow
Write-Host ""

# Compilar el AAB (Android App Bundle) - REQUERIDO por Play Store
Write-Host "Compilando Android App Bundle (AAB)..." -ForegroundColor Yellow
.\gradlew.bat bundleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "AAB firmado compilado exitosamente!" -ForegroundColor Green
    $aabPath = "app\build\outputs\bundle\release\app-release.aab"
    if (Test-Path $aabPath) {
        $aabInfo = Get-Item $aabPath
        Write-Host ""
        Write-Host "=== ANDROID APP BUNDLE (AAB) ===" -ForegroundColor Cyan
        Write-Host "Ubicacion: $aabPath" -ForegroundColor White
        Write-Host "Tamanio: $([math]::Round($aabInfo.Length / 1MB, 2)) MB" -ForegroundColor White
        Write-Host ""
        Write-Host "Este archivo AAB es el que debes subir a Play Store" -ForegroundColor Green
        Write-Host "(Play Store requiere AAB, no APK)" -ForegroundColor Yellow
    } else {
        Write-Host "ADVERTENCIA: No se encontro el AAB en la ubicacion esperada." -ForegroundColor Yellow
    }
    
    # Tambien compilar APK para instalacion directa (opcional)
    Write-Host ""
    Write-Host "Compilando APK para instalacion directa (opcional)..." -ForegroundColor Yellow
    .\gradlew.bat assembleRelease
    if ($LASTEXITCODE -eq 0) {
        $apkPath = "app\build\outputs\apk\release\app-release.apk"
        if (Test-Path $apkPath) {
            $apkInfo = Get-Item $apkPath
            Write-Host "APK generada: $apkPath ($([math]::Round($apkInfo.Length / 1MB, 2)) MB)" -ForegroundColor Cyan
            Write-Host "(La APK es solo para instalacion directa, NO para Play Store)" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host ""
    Write-Host "ERROR: La compilacion fallo." -ForegroundColor Red
    exit 1
}

