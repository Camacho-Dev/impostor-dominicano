# 📱 Actualizar y Generar Nueva APK

## Pasos Rápidos para Actualizar la APK

### 1. Construir el Proyecto Web
```powershell
npm run build
```
Esto genera los archivos actualizados en la carpeta `dist/`

### 2. Sincronizar con Capacitor
```powershell
npx cap sync android
```
Esto copia los archivos actualizados a la carpeta `android/`

### 3. Abrir Android Studio
- Abre Android Studio
- Abre el proyecto: `C:\Users\brayan.dlsantos\JUEGO\android`

### 4. Generar la Nueva APK
En Android Studio:
- Ve a: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- O usa el atajo: `Ctrl + Shift + A` → escribe "Build APK" → Enter
- Espera a que termine la compilación

### 5. Obtener la Nueva APK
- Cuando termine, haz clic en **"locate"** en la notificación
- O navega a: `android\app\build\outputs\apk\debug\app-debug.apk`

## ⚡ Comando Rápido (Todo en Uno)

Si quieres hacerlo todo desde la terminal:

```powershell
# 1. Construir
npm run build

# 2. Sincronizar
npx cap sync android

# 3. Generar APK (requiere Android Studio o Gradle configurado)
cd android
.\gradlew.bat assembleDebug
```

La APK estará en: `android\app\build\outputs\apk\debug\app-debug.apk`

## 📝 Notas Importantes

- **Siempre ejecuta `npm run build`** antes de sincronizar
- **Siempre ejecuta `npx cap sync android`** después de construir
- La primera vez puede tardar más (descarga dependencias)
- Si hay errores, verifica que Android Studio esté actualizado

## 🔄 Flujo Completo

```
1. Hacer cambios en el código
   ↓
2. npm run build
   ↓
3. npx cap sync android
   ↓
4. Abrir Android Studio
   ↓
5. Build APK
   ↓
6. Instalar nueva APK en el dispositivo
```

¡Listo! Tu nueva APK estará actualizada con todos los cambios. 🚀




