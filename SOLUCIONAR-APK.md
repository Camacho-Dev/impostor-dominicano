# 🔧 Solucionar Problema: APK No Instala Cambios

## Problema Común
Cuando instalas una nueva APK pero no ves los cambios, generalmente es por:
1. **Caché del Service Worker** (PWA)
2. **Versión de la app no cambió** (Android piensa que es la misma)
3. **App anterior no se desinstaló**
4. **Build de Android no se limpió**

## ✅ Solución Paso a Paso

### 1. Desinstalar la App Anterior
**IMPORTANTE:** Antes de instalar la nueva APK, desinstala la versión anterior:
- Ve a Configuración → Aplicaciones → El Impostor Dominicano → Desinstalar
- O mantén presionado el ícono de la app → Desinstalar

### 2. Limpiar Build de Android
En Android Studio:
- Ve a: **Build** → **Clean Project**
- Luego: **Build** → **Rebuild Project**
- Esto elimina archivos viejos en caché

### 3. Actualizar Versión de la App
Necesitas cambiar el `versionCode` en `android/app/build.gradle`:
- Abre: `android/app/build.gradle`
- Busca `versionCode` y aumenta el número (ej: de 1 a 2)
- Busca `versionName` y cambia la versión (ej: "1.0.0" a "1.0.1")

### 4. Generar Nueva APK
- **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
- Espera a que termine completamente

### 5. Instalar la Nueva APK
- **Desinstala** la app anterior primero
- Instala la nueva APK
- Abre la app

### 6. Limpiar Caché del Navegador (si es PWA)
Si instalaste como PWA:
- Ve a Configuración → Aplicaciones → El Impostor Dominicano
- Almacenamiento → Limpiar caché
- O desinstala y reinstala

## 🔄 Comandos Rápidos

```powershell
# 1. Limpiar build anterior
cd android
.\gradlew.bat clean

# 2. Volver a la raíz y construir
cd ..
npm run build

# 3. Sincronizar
npx cap sync android

# 4. Generar APK limpia
cd android
.\gradlew.bat assembleDebug
```

## ⚠️ Verificar que los Cambios Están

1. **Revisa la fecha/hora de la APK** - Debe ser reciente
2. **Revisa el tamaño** - Si cambió mucho código, el tamaño puede cambiar
3. **Prueba una característica nueva** - Como la tarjeta "hold to reveal"

## 🎯 Solución Rápida (Recomendada)

1. **Desinstala** la app del teléfono
2. En Android Studio: **Build** → **Clean Project**
3. Actualiza `versionCode` en `build.gradle` (aumenta el número)
4. **Build** → **Build APK(s)**
5. **Instala** la nueva APK

¡Esto debería solucionar el problema! 🚀


