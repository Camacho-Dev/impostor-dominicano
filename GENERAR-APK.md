# 📱 Generar APK - El Impostor Dominicano

## ✅ Proyecto Configurado

El proyecto ya está configurado con Capacitor y la plataforma Android. Solo necesitas seguir estos pasos para generar la APK.

## 📋 Requisitos Previos

### 1. Instalar Java JDK 11 o superior
- **Descargar:** https://adoptium.net/ (recomendado) o https://www.oracle.com/java/technologies/downloads/
- **Versión mínima:** Java 11 (JDK)
- **Verificar instalación:**
  ```powershell
  java -version
  ```
  Debe mostrar versión 11 o superior.

### 2. Instalar Android Studio (opcional pero recomendado)
- **Descargar:** https://developer.android.com/studio
- Android Studio incluye:
  - Android SDK
  - Android SDK Build Tools
  - Android Emulator
  - Gradle

### 3. Configurar Variables de Entorno (si no usas Android Studio)

Si no instalaste Android Studio, necesitas configurar manualmente:

1. **ANDROID_HOME:** Ruta al Android SDK
   ```
   Ejemplo: C:\Users\TuUsuario\AppData\Local\Android\Sdk
   ```

2. **JAVA_HOME:** Ruta al JDK
   ```
   Ejemplo: C:\Program Files\Java\jdk-11
   ```

3. Agregar a PATH:
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%JAVA_HOME%\bin`

## 🚀 Pasos para Generar la APK

### Paso 1: Construir el proyecto web
```powershell
npm run build
```

### Paso 2: Sincronizar con Capacitor
```powershell
npx cap sync android
```

### Paso 3: Generar la APK

#### Opción A: Usando Gradle directamente (requiere Java 11+)
```powershell
cd android
.\gradlew.bat assembleDebug
```

La APK se generará en:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

#### Opción B: Usando Android Studio (más fácil)
1. Abre Android Studio
2. Selecciona "Open an Existing Project"
3. Navega a la carpeta `android` del proyecto
4. Espera a que Gradle sincronice
5. Ve a: **Build > Build Bundle(s) / APK(s) > Build APK(s)**
6. Espera a que termine la compilación
7. Haz clic en "locate" para encontrar la APK

### Paso 4: Instalar la APK en tu dispositivo

#### Opción A: Transferencia manual
1. Conecta tu dispositivo Android por USB
2. Habilita "Depuración USB" en opciones de desarrollador
3. Copia el archivo `app-debug.apk` a tu dispositivo
4. Abre el archivo en tu dispositivo e instálalo

#### Opción B: Usando ADB
```powershell
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

## 🔧 Solución de Problemas

### Error: "Java 8 JVM detected, requires Java 11+"
**Solución:** Instala Java JDK 11 o superior y configura JAVA_HOME.

### Error: "Android SDK not found"
**Solución:** Instala Android Studio o configura ANDROID_HOME manualmente.

### Error: "Gradle daemon failed"
**Solución:** Ejecuta con `--no-daemon`:
```powershell
.\gradlew.bat assembleDebug --no-daemon
```

### Error: "Out of memory"
**Solución:** Aumenta la memoria en `android/gradle.properties`:
```
org.gradle.jvmargs=-Xmx2048m
```

## 📦 Generar APK de Producción (Release)

Para generar una APK firmada para producción:

1. **Crear un keystore:**
   ```powershell
   keytool -genkey -v -keystore impostor-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias impostor
   ```

2. **Configurar signing en `android/app/build.gradle`:**
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               storeFile file('../../impostor-release-key.jks')
               storePassword 'tu-password'
               keyAlias 'impostor'
               keyPassword 'tu-password'
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Generar APK de release:**
   ```powershell
   cd android
   .\gradlew.bat assembleRelease
   ```

La APK de producción estará en:
```
android\app\build\outputs\apk\release\app-release.apk
```

## 📝 Notas Importantes

- La APK de debug (`app-debug.apk`) es para pruebas
- La APK de release (`app-release.apk`) es para distribución
- El tamaño de la APK será aproximadamente 15-25 MB
- La primera compilación puede tardar varios minutos (Gradle descarga dependencias)

## 🎯 Resumen Rápido

```powershell
# 1. Construir proyecto
npm run build

# 2. Sincronizar
npx cap sync android

# 3. Generar APK (requiere Java 11+)
cd android
.\gradlew.bat assembleDebug

# La APK estará en: android\app\build\outputs\apk\debug\app-debug.apk
```

¡Listo! Tu aplicación estará lista para instalar en dispositivos Android. 📱


