# ⚠️ Node.js no está instalado

Para ejecutar este proyecto React, necesitas instalar Node.js primero.

## 📥 Instalación Rápida de Node.js

### Opción 1: Descarga Directa (Recomendado)
1. Ve a: **https://nodejs.org/**
2. Descarga la versión **LTS** (Long Term Support) - la recomendada
3. Ejecuta el instalador
4. Sigue los pasos del instalador (acepta todo por defecto)
5. **Reinicia tu terminal/PowerShell** después de instalar
6. Verifica la instalación ejecutando:
   ```bash
   node --version
   npm --version
   ```

### Opción 2: Usando Chocolatey (Si lo tienes instalado)
```bash
choco install nodejs-lts
```

### Opción 3: Usando Winget (Windows 10/11)
```bash
winget install OpenJS.NodeJS.LTS
```

## ✅ Después de Instalar Node.js

Una vez instalado Node.js, vuelve a esta carpeta y ejecuta:

```bash
npm install
npm run dev
```

## 🔍 Verificar Instalación

Ejecuta estos comandos para verificar:
```bash
node --version    # Debería mostrar algo como v18.x.x o v20.x.x
npm --version     # Debería mostrar algo como 9.x.x o 10.x.x
```

## 📱 Alternativa: Usar sin Node.js

Si no quieres instalar Node.js, puedes:
1. Usar los archivos HTML/CSS/JS originales (en la raíz del proyecto)
2. Abrir `index.html` directamente en el navegador
3. Pero NO tendrás las características de React ni PWA

---

**Nota:** Node.js es necesario para proyectos React modernos. La instalación es rápida y segura.

