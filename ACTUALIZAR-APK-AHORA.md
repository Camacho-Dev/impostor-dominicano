# 🚀 ACTUALIZAR APK - PASOS INMEDIATOS

## ✅ Cambios Realizados:
- ✅ VersionCode actualizado a **7**
- ✅ VersionName actualizado a **1.6.0**
- ✅ Select múltiple reemplazado por botones (más visible en móvil)
- ✅ Pistas más elusivas pero relacionadas
- ✅ Fondo negro-morado con letras blancas-grises

## 📋 PASOS PARA ACTUALIZAR LA APK:

### 1. Compilar el Proyecto Web
Abre una terminal en la carpeta del proyecto y ejecuta:
```powershell
cd C:\Users\brayan.dlsantos\JUEGO
npm run build
```

### 2. Sincronizar con Capacitor
```powershell
npx cap sync android
```

### 3. Abrir Android Studio
1. Abre Android Studio
2. Abre el proyecto: `C:\Users\brayan.dlsantos\JUEGO\android`

### 4. Limpiar el Proyecto
- Ve a: **Build** → **Clean Project**
- Espera a que termine

### 5. Reconstruir el Proyecto
- Ve a: **Build** → **Rebuild Project**
- Espera a que termine completamente

### 6. Generar el APK
- Ve a: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- O usa el atajo: `Ctrl + Shift + A` → escribe "Build APK" → Enter
- Espera a que termine (verás una notificación)

### 7. Encontrar el APK
- Haz clic en **"locate"** en la notificación
- O navega a: `android\app\build\outputs\apk\debug\app-debug.apk`

### 8. ⚠️ IMPORTANTE: Desinstalar la App Anterior
**ANTES de instalar la nueva APK:**
1. Ve a Configuración → Aplicaciones → El Impostor Dominicano
2. Toca "Desinstalar"
3. Confirma la desinstalación

### 9. Instalar la Nueva APK
1. Transfiere el APK a tu teléfono
2. Abre el archivo APK en tu teléfono
3. Permite la instalación desde fuentes desconocidas si es necesario
4. Instala la nueva versión

## ✅ Verificación
Después de instalar, verifica que:
- ✅ Los botones de categorías son visibles y funcionan
- ✅ El fondo es negro-morado
- ✅ Las letras son blancas-grises
- ✅ Las pistas son más elusivas
- ✅ El juego funciona correctamente

## 🔧 Si npm no está disponible:
Si no puedes ejecutar `npm run build`, puedes:
1. Abrir Android Studio directamente
2. Hacer Clean y Rebuild
3. El proyecto usará los archivos en `dist/` que ya están compilados

¡Listo! 🎉




