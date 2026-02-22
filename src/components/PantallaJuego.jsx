import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import CloseButton from './ui/CloseButton';
import Footer from './Footer';

function PantallaJuego({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showConfirm } = useNotificaciones();
  const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
  const [tarjetaVolteada, setTarjetaVolteada] = useState(false);
  const [tarjetaFueVolteada, setTarjetaFueVolteada] = useState(false);
  const [tarjetaPresionada, setTarjetaPresionada] = useState(false);
  const [cambioJugador, setCambioJugador] = useState(false);
  
  // Rastrear qué jugadores han visto su palabra
  const jugadoresQueVieronPalabra = estadoJuego.jugadoresQueVieronPalabra || [];
  const todosVieronPalabra = jugadoresQueVieronPalabra.length === estadoJuego.jugadores?.length;
  // Verificar si este es el último jugador que falta por ver su palabra
  const esUltimoJugador = !jugadoresQueVieronPalabra.includes(nombreJugador) && 
                          jugadoresQueVieronPalabra.length === estadoJuego.jugadores?.length - 1;
  
  // Determinar si es impostor según el modo
  let esImpostor = false;
  let pistaActual = null;
  let palabraMostrar = estadoJuego.palabraSecreta;
  
  if (estadoJuego.modoDiabolico === 'todos-impostores') {
    const jugadorConPalabra = estadoJuego.jugadorConPalabra !== undefined ? estadoJuego.jugadorConPalabra : 0;
    esImpostor = estadoJuego.jugadorActual !== jugadorConPalabra;
    if (esImpostor) {
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
    }
  } else if (estadoJuego.modoDiabolico === 'todos-impostores-total') {
    // Todos son impostores
    esImpostor = true;
    pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
  } else if (estadoJuego.modoDiabolico === 'dos-palabras') {
    // Cada jugador tiene su palabra según el grupo
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Todos tienen palabras, pero diferentes
  } else if (estadoJuego.modoDiabolico === 'palabras-falsas') {
    // Cada jugador tiene una palabra diferente
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Todos creen tener la palabra correcta
  } else if (estadoJuego.modoDiabolico === 'multiples-impostores') {
    // Varios impostores
    esImpostor = estadoJuego.impostores?.includes(estadoJuego.jugadorActual) || false;
    if (esImpostor) {
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
    }
  } else if (estadoJuego.modoDiabolico === 'sin-pistas') {
    // Impostor sin pistas
    esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
    if (esImpostor) {
      pistaActual = "No tienes pistas. Solo sabes que eres el impostor. ¡Buena suerte!";
    }
  } else if (estadoJuego.modoDiabolico === 'pistas-mezcladas') {
    // Algunos tienen la palabra real, otros son impostores con pistas falsas
    esImpostor = estadoJuego.impostores?.includes(estadoJuego.jugadorActual) || false;
    if (esImpostor) {
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
    }
    // Los normales ven la palabra, no necesitan pista
  } else if (estadoJuego.modoDiabolico === 'palabra-compartida') {
    // Todos tienen la misma palabra, pero algunos creen ser impostores
    const creeSerImpostor = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] !== undefined;
    if (creeSerImpostor) {
      esImpostor = true; // Cree ser impostor
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás.";
    } else {
      esImpostor = false; // Tiene la palabra
    }
  } else {
    // Modo normal (puede tener uno o más impostores)
    if (estadoJuego.impostores && estadoJuego.impostores.length > 0) {
      // Múltiples impostores en modo normal
      esImpostor = estadoJuego.impostores.includes(estadoJuego.jugadorActual);
      if (esImpostor) {
        pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Analiza las pistas de los demás para descubrir la palabra secreta.";
      }
    } else {
      // Un solo impostor (comportamiento original)
      esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
      if (esImpostor) {
        pistaActual = estadoJuego.pistaImpostor || "Analiza las pistas de los demás para descubrir la palabra secreta.";
      }
    }
  }

  // Resetear tarjeta cuando cambia el jugador y agregar animación
  useEffect(() => {
    setTarjetaVolteada(false);
    // No resetear tarjetaFueVolteada si el jugador ya vio su palabra
    if (!jugadoresQueVieronPalabra.includes(nombreJugador)) {
      setTarjetaFueVolteada(false);
    }
    setTarjetaPresionada(false);
    setCambioJugador(true);
    
    // Limpiar animación después de 500ms
    const timer = setTimeout(() => {
      setCambioJugador(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [estadoJuego.jugadorActual, nombreJugador, jugadoresQueVieronPalabra]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        const siguiente = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
        actualizarEstado({ jugadorActual: siguiente });
      } else if (e.key === 'ArrowLeft') {
        const anterior = (estadoJuego.jugadorActual - 1 + estadoJuego.jugadores.length) % estadoJuego.jugadores.length;
        actualizarEstado({ jugadorActual: anterior });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [estadoJuego.jugadorActual, estadoJuego.jugadores.length, actualizarEstado]);


  const handleSiguienteJugador = () => {
    // Agregar este jugador a la lista de los que vieron su palabra
    if (!jugadoresQueVieronPalabra.includes(nombreJugador)) {
      const nuevosJugadoresQueVieron = [...jugadoresQueVieronPalabra, nombreJugador];
      actualizarEstado({ 
        jugadoresQueVieronPalabra: nuevosJugadoresQueVieron
      });
    }
    
    // Avanzar al siguiente jugador que no haya visto su palabra
    let siguienteJugador = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
    let intentos = 0;
    const jugadoresQueVieron = jugadoresQueVieronPalabra.includes(nombreJugador) 
      ? [...jugadoresQueVieronPalabra] 
      : [...jugadoresQueVieronPalabra, nombreJugador];
    
    // Buscar un jugador que no haya visto su palabra
    while (jugadoresQueVieron.includes(estadoJuego.jugadores[siguienteJugador]) && intentos < estadoJuego.jugadores.length) {
      siguienteJugador = (siguienteJugador + 1) % estadoJuego.jugadores.length;
      intentos++;
    }
    
    // Si todos vieron su palabra, no avanzar (se mostrará el botón de Revelar Impostor)
    if (jugadoresQueVieron.length < estadoJuego.jugadores.length) {
      actualizarEstado({ jugadorActual: siguienteJugador });
    }
  };

  const handleCerrarJuego = () => {
    showConfirm({
      message: '¿Estás seguro que quieres cerrar el juego? Los nombres de los jugadores se borrarán.',
      confirmText: 'Sí, cerrar',
      cancelText: 'Cancelar',
      onConfirm: () => {
        actualizarEstado({
        jugadores: [],
        numJugadores: 3,
        categorias: ['comida'],
        jugadorActual: 0,
        impostor: null,
        palabraSecreta: '',
        pistas: [],
        jugadoresListos: [],
        jugadorInicia: null,
        modoAdivinanza: false,
        modoAcusacion: false,
        mensajeResultado: '',
        ganador: null,
        pistaImpostor: null,
        pistasImpostores: {},
        jugadorConPalabra: null,
        palabrasJugadores: {},
        impostores: [],
        modosDiabolicos: false,
        modoDiabolicoSeleccionado: null,
        modosAleatorios: false,
        numImpostores: 1,
        jugadoresQueVieronPalabra: []
      });
        setPantalla('inicio');
      }
    });
  };

  return (
    <div className="pantalla activa" style={{ position: 'relative' }}>
      <CloseButton onClick={handleCerrarJuego} title="Cerrar juego" ariaLabel="Cerrar juego y volver al inicio" />

      <div className="contenido-juego">
        <div 
          className="indicador-jugador-actual"
          style={{
            animation: cambioJugador ? 'slideInFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            transform: cambioJugador ? 'translateX(0)' : 'none'
          }}
        >
          <div style={{ 
            fontSize: '1em',
            fontWeight: '500'
          }}>
            Turno de: <span style={{ 
              color: '#4ade80',
              animation: cambioJugador ? 'pulse 0.5s ease-in-out' : 'none'
            }}>{nombreJugador}</span>
          </div>
          <div style={{ fontSize: '0.75em', marginTop: '8px', opacity: 0.7 }}>
            (Desliza o usa → para cambiar de jugador)
          </div>
        </div>

        {esImpostor ? (
          <div className="vista-jugador">
            <div className="palabra-secreta">
              <p style={{ marginBottom: '16px', fontSize: '0.95em', fontWeight: '500' }}>Tu identidad es:</p>
              
              {/* Indicador de estado (solo aparece después de ver la carta) */}
              {tarjetaFueVolteada && !tarjetaVolteada && (
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '12px',
                  padding: '10px 14px',
                  background: 'rgba(76, 222, 128, 0.12)',
                  borderRadius: '10px',
                  border: '1px solid rgba(76, 222, 128, 0.25)',
                  boxShadow: '0 1px 6px rgba(76, 222, 128, 0.15)'
                }}>
                  <span style={{ 
                    fontSize: '0.9em', 
                    color: '#4ade80', 
                    fontWeight: '400',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '1em' }}>✓</span> Ya viste tu identidad
                  </span>
                </div>
              )}
              
              {/* Tarjeta volteable para impostor */}
              <div className="flip-card-wrapper">
              <div 
                className={`flip-card impostor-card ${tarjetaVolteada ? 'flipped' : ''} ${tarjetaPresionada ? 'pressed' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                style={{ 
                  cursor: 'pointer',
                  userSelect: 'none', 
                  WebkitUserSelect: 'none',
                  touchAction: 'manipulation'
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front impostor-front">
                    <div className="tarjeta-cubierta">
                      <div className="jugador-numero">{nombreJugador.toUpperCase()}</div>
                      <p className="instruccion-texto">No digas la palabra a los demás jugadores.</p>
                      <div className="icono-mano">👆</div>
                      <p className="texto-presionar">MANTÉN PRESIONADO<br/>PARA REVELAR</p>
                    </div>
                  </div>
                  <div className="flip-card-back impostor-back">
                    <div className="tarjeta-palabra">
                      <div className="palabra-impostor">🎭 IMPOSTOR</div>
                      {tarjetaFueVolteada && (
                        <div className="checkmark-indicator">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>
              
              {pistaActual && tarjetaVolteada && (
                <div className="pista-impostor-box" style={{ marginTop: '20px' }}>
                  <p className="pista-impostor-label">💡 Pista generada:</p>
                  <div className="pista-impostor-texto">
                    {pistaActual}
                  </div>
                </div>
              )}
              
              <p className="instruccion" style={{ marginTop: '15px' }}>
                {tarjetaFueVolteada 
                  ? 'Mantén presionada la tarjeta para ver tu identidad. Suelta para ocultarla.'
                  : 'Mantén presionada la tarjeta para revelar tu identidad.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="vista-jugador">
            <div className="palabra-secreta">
              <p style={{ marginBottom: '16px', fontSize: '0.95em', fontWeight: '500' }}>Tu palabra secreta es:</p>
              
              {/* Indicador de estado (solo aparece después de ver la carta) */}
              {tarjetaFueVolteada && !tarjetaVolteada && (
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '15px',
                  padding: '12px 18px',
                  background: 'rgba(76, 222, 128, 0.15)',
                  borderRadius: '12px',
                  border: '1.5px solid rgba(76, 222, 128, 0.3)',
                  boxShadow: '0 2px 8px rgba(76, 222, 128, 0.2)'
                }}>
                  <span style={{ 
                    fontSize: '1.1em', 
                    color: '#4ade80', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <span style={{ fontSize: '1.2em' }}>✓</span> Ya viste tu palabra
                  </span>
                </div>
              )}
              
              {/* Tarjeta volteable */}
              <div className="flip-card-wrapper">
              <div 
                className={`flip-card ${tarjetaVolteada ? 'flipped' : ''} ${tarjetaPresionada ? 'pressed' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  // Primero quitar pressed, luego flipped con un pequeño delay para transición suave
                  setTarjetaPresionada(false);
                  setTimeout(() => {
                    setTarjetaVolteada(false);
                  }, 50);
                }}
                style={{ 
                  cursor: 'pointer',
                  userSelect: 'none', 
                  WebkitUserSelect: 'none',
                  touchAction: 'manipulation'
                }}
              >
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <div className="tarjeta-cubierta">
                      <div className="jugador-numero">{nombreJugador.toUpperCase()}</div>
                      <p className="instruccion-texto">No digas la palabra a los demás jugadores.</p>
                      <div className="icono-mano">👆</div>
                      <p className="texto-presionar">MANTÉN PRESIONADO<br/>PARA REVELAR</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="tarjeta-palabra">
                      <div className="palabra-revelada">{palabraMostrar}</div>
                      {tarjetaFueVolteada && (
                        <div className="checkmark-indicator">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>
              
              {estadoJuego.modoDiabolico === 'pistas-mezcladas' && tarjetaVolteada && (
                <div className="pista-automatica-info" style={{ background: 'rgba(76, 222, 128, 0.2)', borderColor: 'rgba(76, 222, 128, 0.4)', marginTop: '15px' }}>
                  <p style={{ fontSize: '0.9em' }}>
                    💡 Tu pista: {pistaActual}
                  </p>
                </div>
              )}
              <p className="instruccion">
                {tarjetaFueVolteada 
                  ? 'Mantén presionada la tarjeta para ver tu palabra. Suelta para ocultarla.'
                  : 'Mantén presionada la tarjeta para revelar tu palabra secreta.'}
              </p>
            </div>
          </div>
        )}

        {tarjetaFueVolteada && !todosVieronPalabra && !esUltimoJugador && (
          <div className="acciones-juego" style={{ marginTop: '30px' }}>
            <button
              className="btn btn-primary"
              onClick={handleSiguienteJugador}
              style={{ 
                width: '100%', 
                fontSize: '0.95em', 
                padding: '12px 18px',
                fontWeight: '600'
              }}
            >
              ✓ Ya viste la palabra, siguiente jugador
            </button>
          </div>
        )}

        {tarjetaFueVolteada && esUltimoJugador && (
          <div className="acciones-juego" style={{ marginTop: '30px' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                // Agregar este jugador a la lista de los que vieron su palabra
                if (!jugadoresQueVieronPalabra.includes(nombreJugador)) {
                  actualizarEstado({ 
                    jugadoresQueVieronPalabra: [...jugadoresQueVieronPalabra, nombreJugador]
                  });
                }
                setPantalla('quien-empieza');
              }}
              style={{ 
                width: '100%', 
                fontSize: '0.95em', 
                padding: '12px 18px',
                fontWeight: '600'
              }}
            >
              🎮 Revelar quién empieza la conversación
            </button>
          </div>
        )}

        {todosVieronPalabra && (
          <div className="acciones-juego" style={{ marginTop: '30px' }}>
            <button
              className="btn btn-primary"
              onClick={() => setPantalla('quien-empieza')}
              style={{ 
                width: '100%', 
                fontSize: '0.95em', 
                padding: '12px 18px',
                fontWeight: '600'
              }}
            >
              🎮 Revelar quién empieza la conversación
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}

export default PantallaJuego;

