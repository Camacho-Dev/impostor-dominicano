# Script para crear el keystore para firmar la APK
# Ejecutar: .\crear-keystore.ps1

$keystorePath = "..\impostor-dominicano.keystore"
$keytoolPath = "$env:JAVA_HOME\bin\keytool.exe"

# Si JAVA_HOME no esta configurado, intentar encontrar Java
if (-not $keytoolPath -or -not (Test-Path $keytoolPath)) {
    $javaPaths = @(
        "C:\Program Files\Java\*\bin\keytool.exe",
        "C:\Program Files (x86)\Java\*\bin\keytool.exe",
        "$env:ProgramFiles\Android\Android Studio\jbr\bin\keytool.exe"
    )
    
    foreach ($path in $javaPaths) {
        $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($found) {
            $keytoolPath = $found.FullName
            break
        }
    }
}

if (-not (Test-Path $keytoolPath)) {
    Write-Host "ERROR: No se encontro keytool. Por favor, instala Java JDK o configura JAVA_HOME." -ForegroundColor Red
    exit 1
}

if (Test-Path $keystorePath) {
    Write-Host "El keystore ya existe en: $keystorePath" -ForegroundColor Yellow
    $sobreescribir = Read-Host "Deseas sobreescribirlo? (s/N)"
    if ($sobreescribir -ne "s" -and $sobreescribir -ne "S") {
        Write-Host "Operacion cancelada." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host "Creando keystore..." -ForegroundColor Green
Write-Host "Keystore: $keystorePath" -ForegroundColor Cyan
Write-Host "Alias: impostor-dominicano" -ForegroundColor Cyan
Write-Host "Validez: 25 anos" -ForegroundColor Cyan
Write-Host ""

# Crear el keystore
& $keytoolPath -genkey -v `
    -keystore $keystorePath `
    -alias impostor-dominicano `
    -keyalg RSA `
    -keysize 2048 `
    -validity 9125 `
    -storepass impostor2026 `
    -keypass impostor2026 `
    -dname "CN=El Impostor Dominicano, OU=Development, O=Brayan Camacho, L=Santo Domingo, ST=Distrito Nacional, C=DO"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Keystore creado exitosamente!" -ForegroundColor Green
    Write-Host "Ubicacion: $keystorePath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANTE: Guarda este keystore de forma segura. Lo necesitaras para actualizar la app en Play Store." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ERROR: No se pudo crear el keystore." -ForegroundColor Red
    exit 1
}
