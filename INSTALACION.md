# 🚀 Instrucciones Rápidas de Instalación

## Paso 1: Instalar Node.js
Si no tienes Node.js instalado:
- Ve a https://nodejs.org/
- Descarga e instala la versión LTS (recomendada)

## Paso 2: Instalar Dependencias
Abre una terminal en la carpeta del proyecto y ejecuta:

```bash
npm install
```

## Paso 3: Ejecutar el Juego
```bash
npm run dev
```

El juego estará disponible en: `http://localhost:3000`

## Paso 4: Construir para Producción
```bash
npm run build
```

Los archivos estarán en la carpeta `dist/`

## 📱 Instalar en el Celular

### Opción 1: Desde el mismo celular
1. Abre el navegador en tu celular
2. Ve a la URL donde está desplegada la app (o usa ngrok/túnel local)
3. Sigue las instrucciones del README.md para instalar como PWA

### Opción 2: Compartir con ngrok (desarrollo)
1. Instala ngrok: `npm install -g ngrok`
2. Ejecuta: `ngrok http 3000`
3. Comparte la URL de ngrok con tu celular
4. Abre en el navegador del celular e instala como PWA

### Opción 3: Desplegar en producción
1. Ejecuta `npm run build`
2. Sube la carpeta `dist/` a:
   - Vercel (gratis): https://vercel.com
   - Netlify (gratis): https://netlify.com
   - GitHub Pages (gratis): https://pages.github.com
3. Accede desde tu celular e instala como PWA

## ✅ Verificar que funciona
- Abre el juego en el navegador
- Deberías ver "El Impostor Dominicano"
- Si ves errores, verifica que todas las dependencias estén instaladas

