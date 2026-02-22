# 🚀 Instrucciones para Subir a GitHub

## ✅ Ya está listo para subir!

El proyecto ya está configurado con:
- ✅ Repositorio Git inicializado
- ✅ Commit inicial realizado
- ✅ GitHub Actions configurado para deployment automático
- ✅ Scripts de ayuda creados

## 🎯 Opción 1: Automática (Recomendada)

### Si tienes un Token de GitHub:

1. **Obtén un token:**
   - Ve a https://github.com/settings/tokens
   - Click en "Generate new token (classic)"
   - Selecciona el scope `repo`
   - Copia el token generado

2. **Ejecuta el script:**
   ```powershell
   .\crear-repo-github.ps1 -GitHubToken TU_TOKEN_AQUI
   ```

   El script:
   - ✅ Creará el repositorio en GitHub
   - ✅ Subirá todo el código
   - ✅ Configurará GitHub Pages automáticamente
   - ✅ Actualizará `capacitor.config.json` con la URL

## 🎯 Opción 2: Manual (Sin Token)

### Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com y inicia sesión
2. Click en el botón **"+"** (arriba a la derecha) > **"New repository"**
3. Completa:
   - **Repository name**: `impostor-dominicano`
   - **Description**: `Juego del Impostor con palabras dominicanas`
   - **Visibility**: Público (para GitHub Pages gratis)
   - **NO marques**: "Add a README file", "Add .gitignore", ni "Choose a license"
4. Click en **"Create repository"**

### Paso 2: Subir el Código

Ejecuta en PowerShell:

```powershell
.\subir-github.ps1
```

Cuando te pida la URL, pega la URL de tu repositorio:
```
https://github.com/TU-USUARIO/impostor-dominicano.git
```

### Paso 3: Activar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. Espera 2-3 minutos a que se complete el deployment

### Paso 4: Configurar capacitor.config.json

Una vez que GitHub Pages esté activo, tu app estará en:
```
https://TU-USUARIO.github.io/impostor-dominicano/
```

Actualiza `capacitor.config.json`:

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

## 🔄 Actualizar la App (Cada vez que hagas cambios)

```bash
# 1. Haz tus cambios en el código
# 2. Compila
npm run build

# 3. Sube a GitHub
git add .
git commit -m "Descripción de los cambios"
git push

# 4. GitHub Actions automáticamente actualizará la app
# 5. Los usuarios verán la actualización la próxima vez que abran la app
```

## ✅ Verificar que Funciona

1. Abre la app en tu teléfono
2. Debería cargar desde GitHub Pages
3. Cada vez que actualices el código y hagas push, la app se actualizará automáticamente

## 🆘 Solución de Problemas

### Error: "remote origin already exists"
```powershell
git remote remove origin
.\subir-github.ps1
```

### Error: "Permission denied"
- Verifica que estés autenticado en GitHub
- Usa un token de acceso personal si es necesario

### GitHub Pages no se activa
- Verifica que el repositorio sea público
- Espera 2-3 minutos después de activar GitHub Actions
- Revisa la pestaña "Actions" en GitHub para ver el estado del deployment

## 📞 ¿Necesitas Ayuda?

Revisa:
- `CREAR-REPOSITORIO.md` - Guía detallada
- `ACTUALIZACION-APK.md` - Información sobre actualizaciones
- `CONFIGURAR-ACTUALIZACION.md` - Configuración rápida



