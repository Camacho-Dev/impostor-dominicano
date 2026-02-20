import { useEffect, useRef } from 'react';

function PantallaRevelarImpostor({ estadoJuego, actualizarEstado, setPantalla }) {
  const audioRef = useRef(null);

  // Reproducir sonido cuando se carga la pantalla
  useEffect(() => {
    const playAudio = async () => {
      if (audioRef.current) {
        try {
          audioRef.current.volume = 0.7; // Volumen al 70%
          await audioRef.current.play();
          console.log('Sonido reproducido correctamente');
        } catch (error) {
          // Si falla la reproducción automática (política del navegador)
          console.log('Reproducción automática bloqueada, intentando con interacción del usuario:', error);
          // Intentar reproducir cuando el usuario haga clic en la pantalla
          const handleClick = () => {
            if (audioRef.current) {
              audioRef.current.play().catch(err => console.log('Error al reproducir:', err));
            }
            document.removeEventListener('click', handleClick);
            document.removeEventListener('touchstart', handleClick);
          };
          document.addEventListener('click', handleClick, { once: true });
          document.addEventListener('touchstart', handleClick, { once: true });
        }
      }
    };
    
    // Pequeño delay para asegurar que el audio esté cargado
    const timer = setTimeout(playAudio, 100);
    return () => clearTimeout(timer);
  }, []);

  // Función para reproducir el sonido manualmente si es necesario
  const reproducirSonido = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reiniciar el audio
      audioRef.current.play().catch(error => {
        console.log('Error al reproducir sonido:', error);
      });
    }
  };
  let impostorReal = null;
  let mensaje = '';
  let titulo = '🎭 El Impostor es:';
  let mostrarResultado = '';

  if (estadoJuego.modoDiabolico === 'todos-impostores') {
    const jugadorConPalabraIndex = estadoJuego.jugadorConPalabra !== undefined ? estadoJuego.jugadorConPalabra : 0;
    const jugadorConPalabra = estadoJuego.jugadores[jugadorConPalabraIndex];
    const impostores = estadoJuego.jugadores.filter((_, index) => index !== jugadorConPalabraIndex);
    titulo = '😈 Resultado del Modo Diabólico:';
    mostrarResultado = `El jugador con la palabra era: ${jugadorConPalabra}\n\nLos impostores eran:\n${impostores.join('\n')}`;
    mensaje = `El jugador con la palabra era: ${jugadorConPalabra}\n\nLos impostores eran: ${impostores.join(', ')}`;
  } else if (estadoJuego.modoDiabolico === 'todos-impostores-total') {
    titulo = '🔥 Resultado: Todos Impostores';
    mostrarResultado = `¡Todos eran impostores!\n\nNadie tenía la palabra real: ${estadoJuego.palabraSecreta}\n\nJugadores: ${estadoJuego.jugadores.join(', ')}`;
    mensaje = `¡Todos eran impostores! La palabra real era: ${estadoJuego.palabraSecreta}`;
  } else if (estadoJuego.modoDiabolico === 'dos-palabras') {
    titulo = '⚔️ Resultado: Dos Palabras Secretas';
    const palabra1 = estadoJuego.palabrasJugadores?.[0] || estadoJuego.palabraSecreta;
    const palabra2 = estadoJuego.palabrasJugadores?.[Math.floor(estadoJuego.jugadores.length / 2)] || estadoJuego.palabraSecreta;
    const grupo1 = estadoJuego.jugadores.slice(0, Math.floor(estadoJuego.jugadores.length / 2));
    const grupo2 = estadoJuego.jugadores.slice(Math.floor(estadoJuego.jugadores.length / 2));
    mostrarResultado = `Grupo 1 (${palabra1}):\n${grupo1.join('\n')}\n\nGrupo 2 (${palabra2}):\n${grupo2.join('\n')}`;
    mensaje = `Había dos palabras secretas:\n\nGrupo 1: ${palabra1}\nGrupo 2: ${palabra2}`;
  } else if (estadoJuego.modoDiabolico === 'palabras-falsas') {
    titulo = '🎭 Resultado: Palabras Falsas';
    const jugadorCorrecto = estadoJuego.jugadores[estadoJuego.jugadorConPalabra];
    mostrarResultado = `La palabra correcta era: ${estadoJuego.palabraSecreta}\n\nEl único con la palabra correcta era: ${jugadorCorrecto}\n\nLos demás tenían palabras diferentes`;
    mensaje = `La palabra correcta era: ${estadoJuego.palabraSecreta}\n\nSolo ${jugadorCorrecto} tenía la palabra correcta`;
  } else if (estadoJuego.modoDiabolico === 'multiples-impostores') {
    titulo = '👥 Resultado: Múltiples Impostores';
    const impostoresNombres = estadoJuego.impostores?.map(i => estadoJuego.jugadores[i]) || [];
    const normales = estadoJuego.jugadores.filter((_, i) => !estadoJuego.impostores?.includes(i));
    mostrarResultado = `Impostores (${impostoresNombres.length}):\n${impostoresNombres.join('\n')}\n\nJugadores normales:\n${normales.join('\n')}`;
    mensaje = `Los impostores eran: ${impostoresNombres.join(', ')}\n\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
  } else if (estadoJuego.modoDiabolico === 'sin-pistas') {
    impostorReal = estadoJuego.jugadores[estadoJuego.impostor];
    mostrarResultado = `El impostor era: ${impostorReal}\n\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
    mensaje = `El impostor era: ${impostorReal}\n\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
  } else if (estadoJuego.modoDiabolico === 'pistas-mezcladas') {
    const impostoresNombres = estadoJuego.impostores?.map(i => estadoJuego.jugadores[i]) || [];
    const normales = estadoJuego.jugadores.filter((_, i) => !estadoJuego.impostores?.includes(i));
    titulo = '🎲 Resultado: Pistas Mezcladas';
    mostrarResultado = `La palabra real era: ${estadoJuego.palabraSecreta}\n\nImpostores (con pistas falsas):\n${impostoresNombres.join('\n')}\n\nJugadores normales (con la palabra real):\n${normales.join('\n')}`;
    mensaje = `La palabra real era: ${estadoJuego.palabraSecreta}\n\nImpostores: ${impostoresNombres.join(', ')}\n\nJugadores normales: ${normales.join(', ')}`;
  } else if (estadoJuego.modoDiabolico === 'palabra-compartida') {
    titulo = '🤝 Resultado: Palabra Compartida';
    const falsosImpostores = Object.keys(estadoJuego.pistasImpostores || {}).map(i => estadoJuego.jugadores[parseInt(i)]);
    mostrarResultado = `La palabra era: ${estadoJuego.palabraSecreta}\n\nTodos tenían la misma palabra, pero estos creían ser impostores:\n${falsosImpostores.join('\n')}`;
    mensaje = `La palabra era: ${estadoJuego.palabraSecreta}\n\nTodos tenían la misma palabra`;
  } else {
    // Modo normal (puede tener uno o más impostores)
    if (estadoJuego.impostores && estadoJuego.impostores.length > 1) {
      // Múltiples impostores en modo normal
      const impostoresNombres = estadoJuego.impostores.map(i => estadoJuego.jugadores[i]);
      const normales = estadoJuego.jugadores.filter((_, i) => !estadoJuego.impostores.includes(i));
      titulo = '🎭 Los Impostores son:';
      mostrarResultado = `Impostores (${impostoresNombres.length}):\n${impostoresNombres.join('\n')}\n\nJugadores normales:\n${normales.join('\n')}`;
      mensaje = `Los impostores eran: ${impostoresNombres.join(', ')}\n\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
    } else {
      // Un solo impostor
      impostorReal = estadoJuego.jugadores[estadoJuego.impostor];
      mostrarResultado = impostorReal;
      mensaje = `El impostor era: ${impostorReal}`;
    }
  }

  const handleContinuar = () => {
    actualizarEstado({ 
      mensajeResultado: mensaje,
      ganador: null
    });

    setPantalla('resultados');
  };

  return (
    <div className="pantalla activa">
      {/* Audio para el sonido de revelación */}
      <audio 
        ref={audioRef} 
        src="/sounds/impostor-reveal.mp3" 
        preload="auto"
        onLoadedData={() => {
          console.log('Audio cargado correctamente');
        }}
        onError={(e) => {
          console.error('Error al cargar el archivo de audio:', e);
          console.log('Ruta esperada: /sounds/impostor-reveal.mp3');
          console.log('Asegúrate de que el archivo existe en public/sounds/impostor-reveal.mp3');
        }}
        onCanPlay={() => {
          console.log('Audio listo para reproducir');
        }}
      />
      
      <h2>🎭 Revelar Impostor</h2>
      
      <div className="pista-automatica-info" style={{ 
        background: 'rgba(245, 87, 108, 0.3)', 
        borderColor: 'rgba(245, 87, 108, 0.5)', 
        margin: '40px 0', 
        padding: '40px',
        textAlign: 'center',
        borderRadius: '15px'
      }}>
        <h3 style={{ fontSize: '1.5em', marginBottom: '20px', color: '#f5576c' }}>
          {titulo}
        </h3>
        <div style={{ 
          fontSize: estadoJuego.modoDiabolico ? '1.3em' : '2.5em', 
          fontWeight: 'bold', 
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
          margin: '20px 0',
          whiteSpace: 'pre-line'
        }}>
          {mostrarResultado}
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        justifyContent: 'center', 
        marginTop: '40px',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={handleContinuar}
          style={{ 
            fontSize: '0.95em', 
            padding: '12px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            minWidth: '140px',
            flex: '1',
            maxWidth: '200px'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }}
        >
          Continuar
        </button>
        <button 
          onClick={() => setPantalla('juego')}
          style={{ 
            fontSize: '0.95em', 
            padding: '12px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
            minWidth: '140px',
            flex: '1',
            maxWidth: '200px'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}
        >
          Volver
        </button>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        fontSize: '0.8em', 
        opacity: 0.7,
        color: 'rgba(255, 255, 255, 0.6)',
        paddingBottom: '20px'
      }}>
        <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
        <p style={{ marginTop: '5px', fontSize: '0.9em' }}>Creado por: <strong>Brayan Camacho</strong></p>
      </div>
    </div>
  );
}

export default PantallaRevelarImpostor;

