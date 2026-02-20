# Script para actualizar desde Git, compilar y generar APK firmada
# Ejecutar: .\actualizar-y-compilar.ps1

Write-Host "=== Actualizar y Compilar APK Firmada ===" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Actualizar desde Git
Write-Host "1. Actualizando desde Git..." -ForegroundColor Yellow
git pull origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo actualizar desde Git" -ForegroundColor Red
    exit 1
}

Write-Host "   Git actualizado correctamente" -ForegroundColor Green
Write-Host ""

# Paso 2: Instalar dependencias (por si hay cambios)
Write-Host "2. Verificando dependencias..." -ForegroundColor Yellow
npm install

Write-Host "   Dependencias verificadas" -ForegroundColor Green
Write-Host ""

# Paso 3: Compilar proyecto web
Write-Host "3. Compilando proyecto web..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: La compilacion del proyecto web fallo" -ForegroundColor Red
    exit 1
}

Write-Host "   Proyecto web compilado" -ForegroundColor Green
Write-Host ""

# Paso 4: Sincronizar con Capacitor
Write-Host "4. Sincronizando con Capacitor..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: La sincronizacion con Capacitor fallo" -ForegroundColor Red
    exit 1
}

Write-Host "   Capacitor sincronizado" -ForegroundColor Green
Write-Host ""

# Paso 5: Compilar APK firmada
Write-Host "5. Compilando APK firmada..." -ForegroundColor Yellow
cd android
.\gradlew.bat assembleRelease

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=== COMPILACION EXITOSA ===" -ForegroundColor Green
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
    if (Test-Path $apkPath) {
        $apkInfo = Get-Item $apkPath
        Write-Host ""
        Write-Host "APK firmada generada:" -ForegroundColor Cyan
        Write-Host "  Ubicacion: $apkPath" -ForegroundColor White
        Write-Host "  Tamanio: $([math]::Round($apkInfo.Length / 1MB, 2)) MB" -ForegroundColor White
        Write-Host "  Fecha: $($apkInfo.LastWriteTime)" -ForegroundColor White
        Write-Host ""
        Write-Host "La APK esta lista para subir a Play Store!" -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "ERROR: La compilacion de la APK fallo" -ForegroundColor Red
    exit 1
}

cd ..

