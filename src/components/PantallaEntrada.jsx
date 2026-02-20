import { useState, useEffect } from 'react';

// Función helper para obtener la URL correcta de imágenes
function getImageUrl(path) {
  // Si estamos en Capacitor (APK) y hay una URL de servidor configurada, usar esa
  if (window.Capacitor || window.cordova) {
    // En Capacitor, cuando está configurado para cargar desde servidor
    // Las imágenes deben usar la URL completa del servidor
    const serverUrl = 'https://Camacho-Dev.github.io/impostor-dominicano';
    return `${serverUrl}/${path.startsWith('/') ? path.substring(1) : path}`;
  }
  // Para web, usar base URL de Vite
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}${path.startsWith('/') ? path.substring(1) : path}`;
}

function PantallaEntrada({ onEntrar }) {
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [imagenCargada, setImagenCargada] = useState(false);

  useEffect(() => {
    // Cargar la imagen primero
    const img = new Image();
    // Usar función helper para obtener URL correcta
    img.src = getImageUrl('poster-entrada-completo.png');
    img.onload = () => {
      setImagenCargada(true);
      // Mostrar contenido cuando la imagen esté cargada
      setTimeout(() => {
        setMostrarContenido(true);
      }, 200);
    };
    img.onerror = () => {
      // Si hay error cargando la imagen, continuar de todas formas
      setImagenCargada(true);
      setMostrarContenido(true);
    };

    // Timeout de seguridad (máximo 3 segundos)
    const timeoutSeguridad = setTimeout(() => {
      setImagenCargada(true);
      setMostrarContenido(true);
    }, 3000);

    return () => {
      clearTimeout(timeoutSeguridad);
    };
  }, []);

  useEffect(() => {
    // Cuando la imagen esté cargada y mostrada, esperar un tiempo y entrar automáticamente
    if (imagenCargada && mostrarContenido) {
      const timer = setTimeout(() => {
        // Animación de salida
        setMostrarContenido(false);
        setTimeout(() => {
          onEntrar();
        }, 500);
      }, 2000); // Mostrar la imagen por 2 segundos antes de entrar

      return () => clearTimeout(timer);
    }
  }, [imagenCargada, mostrarContenido, onEntrar]);

  return (
    <div 
      className="pantalla-entrada"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        overflow: 'hidden',
        touchAction: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none'
      }}
    >
      {/* Imagen del poster como fondo - optimizada para móvil */}
      <img
        src={getImageUrl('poster-entrada-completo.png')}
        alt="EL IMPOSTOR DOMINICANO"
        loading="eager"
        decoding="async"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          opacity: mostrarContenido ? 1 : 0,
          transition: 'opacity 0.5s ease-in',
          WebkitTransform: 'translate3d(0, 0, 0)',
          transform: 'translate3d(0, 0, 0)',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          willChange: 'opacity'
        }}
      />

      {/* Indicador de carga sutil */}
      {!imagenCargada && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 3,
            color: '#fff',
            fontSize: 'clamp(1em, 4vw, 1.3em)',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.5)',
            fontWeight: '700',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          Cargando...
        </div>
      )}
    </div>
  );
}

export default PantallaEntrada;

