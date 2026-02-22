# ⚡ Configuración Rápida de Actualización (5 minutos)

## 🎯 Método Más Simple: GitHub Pages

### Paso 1: Crear Repositorio en GitHub (2 minutos)

1. Ve a https://github.com y crea un nuevo repositorio
2. Nómbralo: `impostor-dominicano-app`
3. **NO** inicialices con README, .gitignore o licencia

### Paso 2: Subir tu App (1 minuto)

```bash
# En la carpeta de tu proyecto
cd C:\Users\brayan.dlsantos\JUEGO

# Inicializar git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Primera versión"

# Agregar tu repositorio remoto (reemplaza TU-USUARIO)
git remote add origin https://github.com/TU-USUARIO/impostor-dominicano-app.git

# Subir
git branch -M main
git push -u origin main
```

### Paso 3: Activar GitHub Pages (1 minuto)

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. O crea una carpeta `docs` y mueve `dist` ahí, luego selecciona `docs` como source

### Paso 4: Configurar Actualización Automática (1 minuto)

Crea un archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Paso 5: Modificar capacitor.config.json

```json
{
  "appId": "com.impostor.dominicano",
  "appName": "El Impostor Dominicano",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "url": "https://TU-USUARIO.github.io/impostor-dominicano-app/",
    "cleartext": false
  }
}
```

### Paso 6: Recompilar y Sincronizar

```bash
npm run build
npx cap sync android
```

---

## 🔄 Proceso de Actualización (Cada vez que hagas cambios)

```bash
# 1. Haz tus cambios en el código
# 2. Compila
npm run build

# 3. Sube a GitHub
git add .
git commit -m "Nueva actualización"
git push

# 4. GitHub Actions automáticamente actualizará la app
# 5. Los usuarios verán la actualización la próxima vez que abran la app
```

---

## 📱 Alternativa: Netlify (Aún Más Fácil)

### Paso 1: Ve a https://netlify.com

### Paso 2: Arrastra tu carpeta `dist/`

### Paso 3: Obtendrás una URL como: `https://impostor-dominicano.netlify.app`

### Paso 4: Actualiza capacitor.config.json:

```json
{
  "server": {
    "url": "https://impostor-dominicano.netlify.app"
  }
}
```

### Paso 5: Recompila

```bash
npm run build
npx cap sync android
```

---

## ✅ Verificar que Funciona

1. Abre la app en tu teléfono
2. Debería cargar desde tu servidor
3. Cada vez que actualices el servidor, la app se actualizará automáticamente

---

## 🎉 ¡Listo!

Ahora puedes actualizar tu app sin generar un nuevo APK cada vez.



