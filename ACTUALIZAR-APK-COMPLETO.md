# 📱 Actualizar APK - Pasos Completos

## ⚠️ IMPORTANTE: Para que los cambios se reflejen

### 1. Desinstalar la App Anterior
**MUY IMPORTANTE:** Antes de instalar la nueva APK, debes:
- Ir a Configuración → Aplicaciones → El Impostor Dominicano
- Tocar "Desinstalar"
- O mantener presionado el icono de la app y seleccionar "Desinstalar"

### 2. Limpiar el Proyecto en Android Studio
1. Abre Android Studio
2. Abre el proyecto: `C:\Users\brayan.dlsantos\JUEGO\android`
3. Ve a: **Build** → **Clean Project**
4. Espera a que termine
5. Luego ve a: **Build** → **Rebuild Project**

### 3. Generar la Nueva APK
En Android Studio:
- Ve a: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- O usa el atajo: `Ctrl + Shift + A` → escribe "Build APK" → Enter
- Espera a que termine la compilación

### 4. Instalar la Nueva APK
- Cuando termine, haz clic en **"locate"** en la notificación
- O navega a: `android\app\build\outputs\apk\debug\app-debug.apk`
- Transfiere el APK a tu teléfono
- **Asegúrate de haber desinstalado la versión anterior primero**
- Instala el nuevo APK

## 🔄 Si los cambios NO aparecen:

1. **Verifica el versionCode:**
   - Debe estar en `5` (o mayor) en `android/app/build.gradle`
   - Si no, Android no reconocerá la nueva versión

2. **Limpia el cache:**
   ```powershell
   cd android
   .\gradlew.bat clean
   ```

3. **Vuelve a construir:**
   ```powershell
   .\gradlew.bat assembleDebug
   ```

4. **Desinstala completamente la app anterior del teléfono**

5. **Instala la nueva APK**

## ✅ Verificación
- VersionCode: 5
- VersionName: "1.4.0"
- Archivos sincronizados: ✓
- Build completado: ✓

¡Listo! Tu nueva APK debería tener todos los cambios. 🚀




