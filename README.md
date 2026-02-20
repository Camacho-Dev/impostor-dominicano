# 🇩🇴 El Impostor Dominicano - React App

Un juego divertido estilo "Among Us" con palabras dominicanas, construido con React y Vite. **Instalable como PWA en tu celular!**

## 🚀 Instalación

### Requisitos
- Node.js 16+ instalado
- npm o yarn

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

3. **Construir para producción:**
```bash
npm run build
```

4. **Previsualizar build de producción:**
```bash
npm run preview
```

## 📱 Instalación en el Celular (PWA)

### Android:
1. Abre la app en Chrome/Edge
2. Toca el menú (3 puntos)
3. Selecciona "Agregar a pantalla de inicio" o "Instalar app"
4. ¡Listo! La app aparecerá como una app nativa

### iOS (Safari):
1. Abre la app en Safari
2. Toca el botón de compartir (cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"
4. ¡Listo! La app aparecerá en tu pantalla de inicio

## 🎮 Cómo Jugar

### Configuración Inicial
1. Selecciona el número de jugadores (mínimo 3, máximo 10)
2. Elige una categoría de palabras dominicanas:
   - 🍽️ Comida Dominicana
   - 💬 Expresiones Dominicanas
   - 🗺️ Lugares de RD
   - ⭐ Personajes Dominicanos
   - 🎵 Música Dominicana
   - ⚾ Deportes Dominicanos
   - 🎉 Festividades
   - 🎭 Tradiciones
   - 🎲 Mezclado (Todas las categorías)

3. Ingresa los nombres de los jugadores
4. ¡Comienza el juego!

### Mecánica del Juego

#### Para los Jugadores Normales:
- Todos reciben la misma **palabra secreta dominicana**
- Debes dar **pistas** sobre la palabra sin mencionarla directamente
- Tu objetivo es descubrir quién es el impostor

#### Para el Impostor:
- **NO conoces** la palabra secreta
- Debes dar pistas falsas para confundir
- Tu objetivo es:
  - 🎯 Adivinar la palabra secreta
  - 💬 Confundir a los demás con pistas falsas
  - 👆 Acusar a otros jugadores
  - 🎭 Hacer que voten a inocentes

### Controles en Móvil

- **Deslizar**: Cambiar entre jugadores (en desarrollo)
- **Tocar**: Seleccionar opciones y botones
- **Teclado**: Escribir pistas y adivinanzas

### Acciones Disponibles

1. **Enviar Pista**: Todos los jugadores dan una pista sobre la palabra
2. **Votar**: Todos votan por quién creen que es el impostor
3. **Adivinar** (solo impostor): El impostor intenta adivinar la palabra
4. **Acusar**: Cualquier jugador puede acusar a otro

### Sistema de Puntos

- **Jugadores normales**: +10 puntos si descubren al impostor
- **Impostor**: +15 puntos si logra que voten a un inocente
- **Impostor**: +20 puntos si adivina la palabra correctamente
- **Acusación correcta**: +15 puntos
- **Impostor confunde**: +10 puntos cuando acusan a un inocente

## 🎯 Estrategias del Modo Troll

El modo "troll" consiste en:
- Dar pistas muy vagas o confusas
- Acusar a jugadores inocentes
- Crear caos en las votaciones
- Hacer que los demás duden de sí mismos

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool y dev server
- **PWA Plugin** - Para hacer la app instalable
- **CSS3** - Estilos modernos con gradientes
- **JavaScript ES6+** - Lógica del juego

## 📝 Características

- ✅ 9 categorías diferentes de palabras dominicanas
- ✅ Más de 200 palabras dominicanas únicas
- ✅ Sistema de puntuación
- ✅ Múltiples rondas
- ✅ Interfaz moderna y responsiva
- ✅ Optimizado para móviles
- ✅ PWA instalable
- ✅ Modo offline (después de primera carga)
- ✅ Modo troll para máxima diversión

## 🇩🇴 Palabras Dominicanas Incluidas

El juego incluye palabras auténticas dominicanas como:
- Comida: Mangú, Sancocho, La Bandera, Tostones, Yaroa...
- Expresiones: ¡Qué lo que!, Tato, Vaina, Jeva, Tiguere...
- Lugares: Santo Domingo, Punta Cana, Zona Colonial...
- Y muchas más en cada categoría!

## 🌐 Despliegue

Para desplegar la app:

1. Construir: `npm run build`
2. Los archivos estarán en la carpeta `dist/`
3. Subir a cualquier hosting estático (Vercel, Netlify, GitHub Pages, etc.)

---

## 📄 Derechos de Autor

© 2026 **Brayan Camacho**. Todos los derechos reservados.

Creado por: **Brayan Camacho**

---

¡Disfruta del juego y que gane el mejor impostor! 🎭
