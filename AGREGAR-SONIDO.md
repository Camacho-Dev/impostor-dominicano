# 🔊 Agregar Sonido de Revelación del Impostor

## Pasos para agregar el sonido:

### 1. Descargar el audio del video de YouTube

El video está en: https://www.youtube.com/watch?v=sbHvogpfwro

Puedes usar alguna de estas opciones:

**Opción A: Usar un convertidor online**
- Visita: https://www.y2mate.com/ o https://ytmp3.cc/
- Pega el enlace del video
- Descarga el archivo en formato MP3
- Renombra el archivo a: `impostor-reveal.mp3`

**Opción B: Usar yt-dlp (herramienta de línea de comandos)**
```bash
# Instalar yt-dlp (si no lo tienes)
pip install yt-dlp

# Descargar solo el audio
yt-dlp -x --audio-format mp3 https://www.youtube.com/watch?v=sbHvogpfwro -o "impostor-reveal.%(ext)s"
```

### 2. Colocar el archivo en el proyecto

1. Crea la carpeta `sounds` dentro de `public`:
   ```
   public/
     sounds/
       impostor-reveal.mp3
   ```

2. Coloca el archivo `impostor-reveal.mp3` en `public/sounds/`

### 3. Verificar que funciona

- El sonido se reproducirá automáticamente cuando se muestre la pantalla de "Revelar Impostor"
- Si la reproducción automática está bloqueada por el navegador, el usuario puede hacer clic en cualquier parte de la pantalla para reproducirlo

## Nota importante:

- El archivo debe estar en formato MP3 para mejor compatibilidad
- El volumen está configurado al 70% para no ser muy fuerte
- El sonido se reproducirá cada vez que se muestre la pantalla de revelación




