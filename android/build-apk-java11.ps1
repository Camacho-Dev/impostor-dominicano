# Build APK usando Java 11+ (requerido por Gradle 8 / Android)
# Ejecutar desde la carpeta JUEGO: .\android\build-apk-java11.ps1

$ErrorActionPreference = "Stop"
$androidDir = $PSScriptRoot

# java -version escribe en stderr; usar cmd para evitar que PowerShell lo tome como error
function Get-JavaVersion {
    param([string]$JavaExe)
    if (-not (Test-Path $JavaExe)) { return 0 }
    try {
        $verStr = cmd /c "`"$JavaExe`" -version 2>&1"
        $m = [regex]::Match($verStr, '"(\d+)')
        if ($m.Success -and $m.Groups[1].Success) { return [int]$m.Groups[1].Value }
    } catch { }
    return 0
}

# Buscar Java 11+ (Android Studio JBR o JDK instalado)
$javaCandidates = @(
    "${env:ProgramFiles}\Android\Android Studio\jbr",
    "${env:ProgramFiles(x86)}\Android\Android Studio\jbr",
    "$env:LOCALAPPDATA\Programs\Android Studio\jbr",
    "${env:ProgramFiles}\Eclipse Adoptium\jdk-17*",
    "${env:ProgramFiles}\Eclipse Adoptium\jdk-21*",
    "${env:ProgramFiles}\Java\jdk-17*",
    "${env:ProgramFiles}\Java\jdk-21*",
    "${env:ProgramFiles}\Java\jdk-11*",
    "C:\Program Files\Microsoft\jdk-17*",
    "C:\Program Files\Microsoft\jdk-21*"
)

$javaHome = $null
if ($env:JAVA_HOME) {
    $testJava = Join-Path $env:JAVA_HOME "bin\java.exe"
    if ((Get-JavaVersion $testJava) -ge 11) { $javaHome = $env:JAVA_HOME }
}

if (-not $javaHome) {
    foreach ($c in $javaCandidates) {
        $resolved = (Resolve-Path $c -ErrorAction SilentlyContinue | Select-Object -First 1).Path
        if ($resolved -and (Test-Path (Join-Path $resolved "bin\java.exe"))) {
            if ((Get-JavaVersion (Join-Path $resolved "bin\java.exe")) -ge 11) {
                $javaHome = $resolved
                break
            }
        }
    }
}

if (-not $javaHome) {
    Write-Host "No se encontro Java 11 o superior." -ForegroundColor Red
    Write-Host ""
    Write-Host "Opciones:" -ForegroundColor Yellow
    Write-Host "1. Instala Android Studio (incluye JDK): https://developer.android.com/studio"
    Write-Host "2. O instala JDK 17: https://adoptium.net/"
    Write-Host "3. Luego ejecuta en PowerShell (sustituye la ruta):" -ForegroundColor Cyan
    Write-Host '   $env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"'
    Write-Host "   cd $androidDir"
    Write-Host "   .\gradlew.bat assembleDebug"
    exit 1
}

Write-Host "Usando Java: $javaHome" -ForegroundColor Green
$env:JAVA_HOME = $javaHome
Set-Location $androidDir
& .\gradlew.bat assembleDebug
$exitCode = $LASTEXITCODE
if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "APK generada en:" -ForegroundColor Green
    Write-Host "$androidDir\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
}
exit $exitCode
