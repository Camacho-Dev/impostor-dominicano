# 🔄 Sistema de Actualización de APK

## 📋 Opciones para Actualizar sin Reinstalar

Hay **3 formas principales** de actualizar tu app sin que los usuarios tengan que reinstalar manualmente:

---

## 🎯 **Opción 1: Actualización de Contenido Web (Recomendada - Más Fácil)**

### ¿Cómo funciona?
- Solo actualizas los archivos web (HTML, JS, CSS) sin cambiar el APK
- El APK actúa como un "contenedor" que carga el contenido web
- Cuando actualizas el contenido, la app se actualiza automáticamente

### ✅ Ventajas:
- ✅ No necesitas generar un nuevo APK
- ✅ Actualización instantánea para todos los usuarios
- ✅ No requiere permisos especiales
- ✅ Funciona sin servidor (puedes usar GitHub Pages, Netlify, etc.)

### 📝 Pasos para Implementar:

#### 1. **Configurar un Servidor Web** (Elige uno):

**Opción A: GitHub Pages (Gratis)**
```bash
# 1. Crea un repositorio en GitHub
# 2. Sube tu carpeta dist/ al repositorio
# 3. Activa GitHub Pages en la configuración del repositorio
# 4. Tu app estará en: https://tu-usuario.github.io/tu-repo/
```

**Opción B: Netlify (Gratis)**
```bash
# 1. Ve a https://netlify.com
# 2. Arrastra tu carpeta dist/ a Netlify
# 3. Obtendrás una URL como: https://tu-app.netlify.app
```

**Opción C: Vercel (Gratis)**
```bash
# 1. Ve a https://vercel.com
# 2. Conecta tu repositorio de GitHub
# 3. Cada vez que hagas build, se actualiza automáticamente
```

#### 2. **Modificar capacitor.config.json**:

```json
{
  "appId": "com.impostor.dominicano",
  "appName": "El Impostor Dominicano",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "url": "https://tu-servidor.com",  // ← Agrega tu URL aquí
    "cleartext": false
  }
}
```

#### 3. **Proceso de Actualización**:

```bash
# 1. Haz tus cambios en el código
# 2. Compila: npm run build
# 3. Sube la carpeta dist/ a tu servidor
# 4. Los usuarios verán la actualización la próxima vez que abran la app
```

---

## 🚀 **Opción 2: Actualización Automática con Servidor**

### ¿Cómo funciona?
- La app verifica si hay una nueva versión en un servidor
- Si hay actualización, descarga los nuevos archivos automáticamente
- Se aplica la actualización sin reinstalar

### ✅ Ventajas:
- ✅ Control total sobre cuándo se actualiza
- ✅ Puedes forzar actualizaciones críticas
- ✅ Puedes mostrar changelog antes de actualizar

### 📝 Implementación:

Ya está implementado en tu proyecto:
- `src/utils/actualizador.js` - Lógica de verificación
- `src/components/Actualizador.jsx` - UI de actualización

**Para activarlo:**

1. **Agrega el componente en App.jsx**:
```jsx
import Actualizador from './components/Actualizador';

function App() {
  return (
    <div>
      <Actualizador />
      {/* ... resto de tu app ... */}
    </div>
  );
}
```

2. **Configura tu servidor** (crea un archivo JSON):
```json
// https://tu-servidor.com/api/version.json
{
  "version": "1.2.0",
  "url": "https://tu-servidor.com/actualizaciones/v1.2.0/",
  "forzar": false,
  "changelog": "Nuevas características y correcciones"
}
```

3. **Actualiza la URL en actualizador.js**:
```javascript
const URL_VERSION = 'https://tu-servidor.com/api/version.json';
```

---

## 📦 **Opción 3: Actualización de APK Automática (Avanzada)**

### ¿Cómo funciona?
- La app detecta una nueva versión del APK
- Descarga el nuevo APK automáticamente
- Lo instala sin intervención del usuario

### ⚠️ Requisitos:
- Necesitas permisos de instalación en Android
- Requiere un servidor para alojar los APKs
- Más complejo de implementar

### 📝 Implementación Básica:

1. **Instalar plugin de Capacitor**:
```bash
npm install @capacitor/app
```

2. **Crear servicio de actualización**:
```javascript
import { App } from '@capacitor/app';
import { Filesystem, Directory } from '@capacitor/filesystem';

async function descargarYInstalarAPK(urlAPK) {
  // Descargar APK
  const response = await fetch(urlAPK);
  const blob = await response.blob();
  
  // Guardar en el dispositivo
  await Filesystem.writeFile({
    path: 'actualizacion.apk',
    data: await blobToBase64(blob),
    directory: Directory.External
  });
  
  // Instalar (requiere permisos especiales)
  // Esto requiere configuración adicional en AndroidManifest.xml
}
```

---

## 🎯 **Recomendación para tu Proyecto**

### **Usa la Opción 1 (Actualización de Contenido Web)**

Es la más simple y efectiva para tu caso:

1. **Configura GitHub Pages o Netlify** (5 minutos)
2. **Modifica capacitor.config.json** para apuntar a tu servidor
3. **Cada vez que actualices:**
   ```bash
   npm run build
   # Sube dist/ a tu servidor
   ```

4. **Los usuarios automáticamente verán la actualización** la próxima vez que abran la app

---

## 📱 **Flujo de Trabajo Recomendado**

### Desarrollo:
```bash
npm run dev  # Desarrollo local
```

### Producción:
```bash
npm run build              # Compilar
npx cap sync android       # Sincronizar con Android
# Subir dist/ a tu servidor web
```

### Actualización:
```bash
# 1. Haz cambios en el código
# 2. npm run build
# 3. Sube dist/ a tu servidor
# 4. ¡Listo! Los usuarios verán la actualización
```

---

## 🔧 **Configuración Avanzada**

### Para forzar actualización inmediata:

En `capacitor.config.json`:
```json
{
  "server": {
    "url": "https://tu-servidor.com",
    "cleartext": false,
    "allowNavigation": ["*"]
  }
}
```

### Para desarrollo local:
```json
{
  "server": {
    "url": "http://192.168.1.100:3000",  // Tu IP local
    "cleartext": true
  }
}
```

---

## ❓ **Preguntas Frecuentes**

**P: ¿Necesito generar un nuevo APK cada vez?**
R: No, solo si cambias la configuración nativa (permisos, plugins, etc.)

**P: ¿Los usuarios perderán sus datos?**
R: No, los datos en localStorage se mantienen

**P: ¿Funciona sin internet?**
R: La primera vez necesita internet para cargar. Después puede funcionar offline si configuras cache

**P: ¿Es seguro?**
R: Sí, siempre usa HTTPS en producción

---

## 🚨 **Importante**

- **Siempre incrementa la versión** en `package.json` antes de actualizar
- **Prueba en desarrollo** antes de publicar
- **Mantén backups** de versiones anteriores
- **Usa HTTPS** en producción (no HTTP)

---

## 📞 **Soporte**

Si necesitas ayuda con la implementación, revisa:
- Documentación de Capacitor: https://capacitorjs.com/docs
- Documentación de GitHub Pages: https://pages.github.com
- Documentación de Netlify: https://docs.netlify.com

