# 📦 Crear Repositorio en GitHub - Guía Rápida

## Paso 1: Crear el Repositorio en GitHub

1. Ve a https://github.com y inicia sesión
2. Click en el botón **"+"** (arriba a la derecha) > **"New repository"**
3. Completa:
   - **Repository name**: `impostor-dominicano`
   - **Description**: `Juego del Impostor con palabras dominicanas`
   - **Visibility**: Público (para GitHub Pages gratis)
   - **NO marques**: "Add a README file", "Add .gitignore", ni "Choose a license"
4. Click en **"Create repository"**

## Paso 2: Ejecutar el Script

Abre PowerShell en esta carpeta y ejecuta:

```powershell
.\subir-github.ps1
```

Cuando te pida la URL, pega la URL de tu repositorio (ejemplo: `https://github.com/TU-USUARIO/impostor-dominicano.git`)

## Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Espera unos minutos a que se complete el deployment

## Paso 4: Obtener la URL de tu App

Tu app estará disponible en:
```
https://TU-USUARIO.github.io/impostor-dominicano/
```

## Paso 5: Configurar capacitor.config.json

Una vez que tengas la URL, actualiza `capacitor.config.json`:

```json
{
  "appId": "com.impostor.dominicano",
  "appName": "El Impostor Dominicano",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "url": "https://TU-USUARIO.github.io/impostor-dominicano/",
    "cleartext": false
  }
}
```

Luego ejecuta:
```bash
npm run build
npx cap sync android
```

## ✅ ¡Listo!

Ahora cada vez que hagas cambios:

```bash
npm run build
git add .
git commit -m "Descripción de los cambios"
git push
```

GitHub Actions automáticamente actualizará tu app en GitHub Pages, y los usuarios verán la actualización la próxima vez que abran la app.



