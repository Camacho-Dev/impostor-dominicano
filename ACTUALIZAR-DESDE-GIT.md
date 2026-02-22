# 🔄 Actualizar APK desde Git

## ✅ Respuesta Rápida

**Sí, puedes actualizar la APK desde Git**, pero necesitas compilarla localmente porque el keystore está en tu máquina.

## 📋 Flujo de Trabajo Recomendado

### Opción 1: Proceso Manual (Simple)

1. **Actualizar código desde Git:**
   ```powershell
   git pull origin main
   ```

2. **Compilar APK firmada:**
   ```powershell
   cd android
   .\build-release.ps1
   ```

3. **Subir APK a Play Store:**
   - Usa Google Play Console para subir la nueva APK

### Opción 2: Proceso Automatizado (Recomendado)

Usa el script que automatiza todo:

```powershell
.\actualizar-y-compilar.ps1
```

Este script hace:
- ✅ Actualiza desde Git
- ✅ Instala dependencias
- ✅ Compila el proyecto web
- ✅ Sincroniza con Capacitor
- ✅ Compila la APK firmada

## 🔐 ¿Por qué no se puede compilar automáticamente desde GitHub?

**El keystore NO debe estar en Git** por seguridad:
- El keystore contiene las credenciales para firmar la APK
- Si alguien lo obtiene, podría firmar APKs maliciosas con tu nombre
- Google Play Store requiere el mismo keystore para todas las actualizaciones

**Por eso:**
- ✅ El código fuente SÍ va a Git
- ❌ El keystore NO va a Git (está en `.gitignore`)
- ✅ La APK se compila localmente con tu keystore

## 🚀 Proceso Completo de Actualización

### 1. Hacer cambios en el código
```powershell
# Editar archivos...
# Probar localmente...
```

### 2. Subir cambios a Git
```powershell
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

### 3. Compilar APK firmada localmente
```powershell
.\actualizar-y-compilar.ps1
```

O manualmente:
```powershell
npm run build
npx cap sync android
cd android
.\build-release.ps1
```

### 4. Subir APK a Play Store
- Abre Google Play Console
- Ve a "Producción" o "Pruebas internas"
- Sube la nueva APK desde: `android/app/build/outputs/apk/release/app-release.apk`

## ⚙️ Opción Avanzada: Automatizar con GitHub Actions

Si quieres automatizar completamente (requiere configuración adicional):

1. **Subir el keystore a GitHub Secrets** (no recomendado por seguridad)
2. **O usar un servicio de CI/CD** que tenga acceso al keystore

**Nota:** Esta opción es más compleja y menos segura. El método local es el recomendado.

## 📝 Resumen

| Acción | Dónde | Cuándo |
|--------|-------|--------|
| Actualizar código | Git | Siempre |
| Compilar APK | Tu máquina | Después de cambios |
| Firmar APK | Tu máquina | Automático (con keystore) |
| Subir a Play Store | Play Console | Después de compilar |

## ⚠️ Importante

- **Guarda el keystore de forma segura** - Lo necesitarás para todas las actualizaciones
- **No subas el keystore a Git** - Ya está en `.gitignore`
- **Usa el mismo keystore siempre** - Play Store requiere consistencia

## 🎯 Comando Rápido

Para actualizar y compilar todo de una vez:

```powershell
.\actualizar-y-compilar.ps1
```

¡Y listo! 🚀



