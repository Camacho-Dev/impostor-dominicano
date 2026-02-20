import { useState, useEffect } from 'react';

function PantallaEntrada({ onEntrar }) {
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [imagenCargada, setImagenCargada] = useState(false);

  useEffect(() => {
    // Cargar la imagen primero
    const img = new Image();
    img.src = '/poster-entrada-completo.png';
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
        src="/poster-entrada-completo.png"
        alt="EL IMPOSTOR DOMINICANO"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center center',
          opacity: mostrarContenido ? 1 : 0,
          transition: 'opacity 0.8s ease-in',
          filter: 'brightness(0.98) contrast(1.02)',
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)',
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
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

