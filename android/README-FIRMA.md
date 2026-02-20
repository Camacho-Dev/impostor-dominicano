# Firma de APK - El Impostor Dominicano

Este documento explica cómo firmar la APK para publicar en Google Play Store.

## Configuración Actual

- **Keystore**: `impostor-dominicano.keystore` (ubicado en la raíz del proyecto)
- **Alias**: `impostor-dominicano`
- **Validez**: 25 años (9125 días)
- **Algoritmo**: RSA 2048 bits

## Archivos de Configuración

- `keystore.properties`: Contiene las credenciales del keystore (NO se sube a Git)
- `app/build.gradle`: Configurado para usar el keystore automáticamente en builds release

## Pasos para Compilar APK Firmada

### 1. Verificar que el keystore existe

El keystore debe estar en: `../impostor-dominicano.keystore` (relativo a la carpeta android/)

Si no existe, ejecuta:
```powershell
cd android
.\crear-keystore.ps1
```

### 2. Compilar la APK firmada

```powershell
cd android
.\build-release.ps1
```

O manualmente:
```powershell
cd android
.\gradlew.bat assembleRelease
```

### 3. Ubicación de la APK

La APK firmada se generará en:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Importante

⚠️ **GUARDA EL KEYSTORE DE FORMA SEGURA**

- El keystore (`impostor-dominicano.keystore`) es necesario para actualizar la app en Play Store
- Si lo pierdes, NO podrás actualizar la app existente
- Haz una copia de seguridad en un lugar seguro
- El archivo `keystore.properties` contiene las contraseñas (también debe estar seguro)

## Credenciales Actuales

- **Store Password**: `impostor2026`
- **Key Password**: `impostor2026`
- **Key Alias**: `impostor-dominicano`

**NOTA**: Si cambias estas contraseñas, actualiza también `keystore.properties`

## Verificar Firma de APK

Para verificar que la APK está firmada correctamente:

```powershell
# Usando jarsigner (incluido en JDK)
jarsigner -verify -verbose -certs android\app\build\outputs\apk\release\app-release.apk

# O usando apksigner (Android SDK)
apksigner verify --verbose android\app\build\outputs\apk\release\app-release.apk
```

## Troubleshooting

### Error: "keystore.properties not found"
- Verifica que el archivo `android/keystore.properties` existe
- Si no existe, créalo con las credenciales correctas

### Error: "Keystore file not found"
- Verifica que `impostor-dominicano.keystore` existe en la raíz del proyecto
- La ruta relativa desde `android/` debe ser `../impostor-dominicano.keystore`

### Error: "Wrong password"
- Verifica las contraseñas en `keystore.properties`
- Asegúrate de que coinciden con las del keystore

