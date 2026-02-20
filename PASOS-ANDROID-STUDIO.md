# 📱 Generar APK con Android Studio - Pasos Rápidos

## ✅ Pasos Simples:

### 1. Abrir el Proyecto en Android Studio
   - En la pantalla de bienvenida, haz clic en **"Open"** (o "Abrir")
   - Navega a la carpeta: `C:\Users\brayan.dlsantos\JUEGO\android`
   - Selecciona la carpeta `android` y haz clic en "OK"
   - Espera a que Android Studio sincronice el proyecto (puede tardar unos minutos la primera vez)

### 2. Esperar a que Gradle Sincronice
   - Android Studio descargará automáticamente las dependencias necesarias
   - Verás una barra de progreso en la parte inferior
   - Espera hasta que termine (puede tardar 5-10 minutos la primera vez)

### 3. Generar la APK
   - En el menú superior, ve a: **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - O usa el atajo: Presiona `Ctrl + Shift + A` y escribe "Build APK"
   - Espera a que termine la compilación (verás un mensaje en la parte inferior)

### 4. Encontrar la APK
   - Cuando termine, verás una notificación en la esquina inferior derecha
   - Haz clic en **"locate"** o **"Show in Explorer"**
   - O navega manualmente a:
     ```
     android\app\build\outputs\apk\debug\app-debug.apk
     ```

### 5. Instalar en tu Dispositivo
   - Conecta tu teléfono Android por USB
   - Habilita "Depuración USB" en opciones de desarrollador
   - Copia el archivo `app-debug.apk` a tu teléfono
   - Abre el archivo en tu teléfono e instálalo

## ⚠️ Si hay Errores:

- **Error de Gradle Sync:** Espera a que termine completamente
- **Error de SDK:** Ve a **Tools** → **SDK Manager** e instala los componentes faltantes
- **Error de Java:** Android Studio debería usar su propio JDK automáticamente

## 🎯 Resumen Visual:

1. **Open** → Selecciona carpeta `android`
2. Espera sincronización
3. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. Haz clic en **"locate"** cuando termine
5. Copia la APK a tu teléfono e instala

¡Eso es todo! 🚀

