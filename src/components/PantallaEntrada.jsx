import { useState, useEffect } from 'react';

function getImageUrl(path) {
  if (window.Capacitor || window.cordova) {
    const serverUrl = 'https://Camacho-Dev.github.io/impostor-dominicano';
    return `${serverUrl}/${path.startsWith('/') ? path.substring(1) : path}`;
  }
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}${path.startsWith('/') ? path.substring(1) : path}`;
}

function PantallaEntrada({ onEntrar }) {
  const [mostrarContenido, setMostrarContenido] = useState(false);
  const [imagenCargada, setImagenCargada] = useState(false);
  const [errorImagen, setErrorImagen] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = getImageUrl('poster-entrada-completo.png');
    img.onload = () => {
      setImagenCargada(true);
      setErrorImagen(false);
      setTimeout(() => setMostrarContenido(true), 200);
    };
    img.onerror = () => {
      setImagenCargada(true);
      setErrorImagen(true);
      setMostrarContenido(true);
    };

    const timeoutSeguridad = setTimeout(() => {
      setImagenCargada(true);
      setMostrarContenido(true);
    }, 3000);

    return () => clearTimeout(timeoutSeguridad);
  }, []);

  useEffect(() => {
    if (imagenCargada && mostrarContenido) {
      const timer = setTimeout(() => {
        setMostrarContenido(false);
        setTimeout(onEntrar, 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [imagenCargada, mostrarContenido, onEntrar]);

  return (
    <div
      className="pantalla-entrada"
      style={{
        position: 'fixed',
        inset: 0,
        background: errorImagen ? 'linear-gradient(165deg, #0c0c14 0%, #1e3c72 50%, #16213e 100%)' : '#000',
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
      {/* Imagen del poster o fallback */}
      {!errorImagen ? (
        <img
          src={getImageUrl('poster-entrada-completo.png')}
          alt="EL IMPOSTOR DOMINICANO"
          loading="eager"
          decoding="async"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: mostrarContenido ? 1 : 0,
            transition: 'opacity 0.5s ease-in'
          }}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            opacity: mostrarContenido ? 1 : 0,
            transition: 'opacity 0.5s ease-in'
          }}
        >
          <h1
            style={{
              color: '#fff',
              fontSize: 'clamp(1.8em, 6vw, 2.5em)',
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: '12px'
            }}
          >
            🇩🇴 El Impostor Dominicano
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '1.1em'
            }}
          >
            LO' MENORE' Y SU LIO
          </p>
        </div>
      )}

      {/* Indicador de carga: spinner + skeleton */}
      {!imagenCargada && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              border: '3px solid rgba(255,255,255,0.2)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              animation: 'entrada-spinner 0.8s linear infinite'
            }}
          />
          <p
            style={{
              color: '#fff',
              fontSize: 'clamp(0.95em, 3vw, 1.1em)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              animation: 'entrada-pulse 1.5s ease-in-out infinite'
            }}
          >
            Cargando
          </p>
          <div
            style={{
              width: '120px',
              height: '4px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: '40%',
                height: '100%',
                background: 'linear-gradient(90deg, #667eea, #764ba2)',
                borderRadius: '4px',
                animation: 'entrada-pulse 1.2s ease-in-out infinite'
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default PantallaEntrada;
