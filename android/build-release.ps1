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

# Compilar la APK release
.\gradlew.bat assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "APK firmada compilada exitosamente!" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkInfo = Get-Item $apkPath
        Write-Host "Ubicacion: $apkPath" -ForegroundColor Cyan
        Write-Host "Tamanio: $([math]::Round($apkInfo.Length / 1MB, 2)) MB" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "La APK esta lista para subir a Play Store!" -ForegroundColor Green
    } else {
        Write-Host "ADVERTENCIA: No se encontro la APK en la ubicacion esperada." -ForegroundColor Yellow
    }
} else {
    Write-Host ""
    Write-Host "ERROR: La compilacion fallo." -ForegroundColor Red
    exit 1
}

