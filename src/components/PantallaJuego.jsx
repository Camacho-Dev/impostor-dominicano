import { useState, useEffect } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import { useLanguage } from '../context/LanguageContext';
import { vibrateLight } from '../utils/vibration';
import CloseButton from './ui/CloseButton';
import AyudaContextual from './AyudaContextual';
import Footer from './Footer';

function PantallaJuego({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showConfirm } = useNotificaciones();
  const { t } = useLanguage();
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
  } else if (estadoJuego.modoDiabolico === 'dos-palabras') {
    // Cada jugador tiene su palabra según el grupo
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Todos tienen palabras, pero diferentes
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
      esImpostor = false;
    }
  } else if (estadoJuego.modoDiabolico === 'rotacion-palabras') {
    // Cada jugador tiene una palabra diferente
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Nadie es impostor realmente
  } else if (estadoJuego.modoDiabolico === 'palabra-fantasma') {
    // Algunos tienen una palabra fantasma que no existe
    const tieneFantasma = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] === 'PALABRA FANTASMA';
    if (tieneFantasma) {
      esImpostor = true;
      palabraMostrar = 'PALABRA FANTASMA';
      pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || "Tienes una palabra que NO existe. ¡Confusión total!";
    } else {
      palabraMostrar = estadoJuego.palabraSecreta;
      esImpostor = false;
    }
  } else if (estadoJuego.modoDiabolico === 'modo-espejo') {
    // Mitad tiene palabra A, mitad tiene palabra B
    palabraMostrar = estadoJuego.palabrasJugadores?.[estadoJuego.jugadorActual] || estadoJuego.palabraSecreta;
    esImpostor = false; // Nadie es impostor, pero tienen palabras diferentes
  } else {
    // Modo normal (puede tener uno o más impostores)
    if (estadoJuego.impostores && estadoJuego.impostores.length > 0) {
      // Múltiples impostores en modo normal
      esImpostor = estadoJuego.impostores.includes(estadoJuego.jugadorActual);
      if (esImpostor) {
        pistaActual = estadoJuego.pistasImpostores?.[estadoJuego.jugadorActual] || null;
      }
    } else {
      // Un solo impostor (comportamiento original)
      esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
      if (esImpostor) {
        if (estadoJuego.mostrarPistaImpostor === false) {
          pistaActual = null;
        } else {
          pistaActual = estadoJuego.pistaImpostor || null;
        }
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
    vibrateLight();
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
      message: t('closeGameConfirm'),
      confirmText: t('confirm'),
      cancelText: t('cancel'),
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
    <div className="pantalla activa pantalla-juego" style={{ position: 'relative' }}>
      <CloseButton onClick={handleCerrarJuego} title={t('closeGame')} ariaLabel={t('closeGame')} />
      <div style={{ position: 'absolute', top: 12, right: 52, zIndex: 5 }}>
        <AyudaContextual translationKey="helpJuego" />
      </div>

      {/* Indicador de progreso */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        padding: '10px 20px 0',
        flexWrap: 'wrap'
      }}>
        {estadoJuego.jugadores.map((j, i) => {
          const vio = jugadoresQueVieronPalabra.includes(j);
          const esActual = i === estadoJuego.jugadorActual;
          return (
            <div key={i} style={{
              width: esActual ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: vio
                ? 'rgba(74,222,128,0.7)'
                : esActual
                  ? 'rgba(102,126,234,0.9)'
                  : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }} />
          );
        })}
        <span style={{ fontSize: '0.75em', opacity: 0.5, marginLeft: 6 }}>
          {Math.min(jugadoresQueVieronPalabra.length + 1, estadoJuego.jugadores.length)} / {estadoJuego.jugadores.length}
        </span>
      </div>

      <div className="contenido-juego">
        <div className="contenido-juego-scroll">
        {esImpostor ? (
          <div className="vista-jugador">
            <div className="palabra-secreta">
              <p style={{ marginBottom: '16px', fontSize: '1em', fontWeight: '600', opacity: 0.8 }}>{t('yourSecretWord')}</p>
              
              {/* Tarjeta volteable para impostor (pista dentro del cuadro) */}
              <div className="flip-card-wrapper">
              <div 
                className={`flip-card impostor-card ${tarjetaVolteada ? 'flipped' : ''} ${tarjetaPresionada ? 'pressed' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                    vibrateLight();
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(false);
                  setTimeout(() => setTarjetaVolteada(false), 50);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(false);
                  setTimeout(() => setTarjetaVolteada(false), 50);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                    vibrateLight();
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(false);
                  setTimeout(() => setTarjetaVolteada(false), 50);
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
                      <p className="instruccion-texto">{t('doNotTell')}</p>
                      <div className="icono-mano">👆</div>
                      <p className="texto-presionar">{t('holdToRevealLine1')}<br />{t('holdToRevealLine2')}</p>
                    </div>
                  </div>
                  <div className="flip-card-back impostor-back">
                    <div className="tarjeta-palabra tarjeta-palabra-impostor">
                      <div className="palabra-impostor palabra-reveal-anim">🎭 {t('impostor')}</div>
                      {pistaActual && (
                        <div className="pista-dentro-tarjeta">
                          <span className="pista-dentro-tarjeta-label">💡 {t('yourHint')}</span>
                          <span className="pista-dentro-tarjeta-texto">{pistaActual}</span>
                        </div>
                      )}
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
              
              {/* Botones de avance para el impostor */}
              {tarjetaFueVolteada && !todosVieronPalabra && !esUltimoJugador && (
                <button
                  className="btn btn-primary"
                  onClick={handleSiguienteJugador}
                  style={{ width: '100%', fontSize: '1em', padding: '16px 18px', fontWeight: '700', marginTop: '18px' }}
                >
                  ✓ {t('sawWordNext')}
                </button>
              )}
              {tarjetaFueVolteada && esUltimoJugador && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!jugadoresQueVieronPalabra.includes(nombreJugador)) {
                      actualizarEstado({ jugadoresQueVieronPalabra: [...jugadoresQueVieronPalabra, nombreJugador] });
                    }
                    setPantalla('quien-empieza');
                  }}
                  style={{ width: '100%', fontSize: '1em', padding: '16px 18px', fontWeight: '700', marginTop: '18px' }}
                >
                  🎮 {t('revealWhoStarts')}
                </button>
              )}

              <p className="instruccion" style={{ marginTop: '15px', fontSize: '0.95em' }}>
                {tarjetaFueVolteada ? t('holdToSee') : t('holdToRevealHint')}
              </p>
            </div>
          </div>
        ) : (
          <div className="vista-jugador">
            <div className="palabra-secreta">
              <p style={{ marginBottom: '16px', fontSize: '1em', fontWeight: '600', opacity: 0.8 }}>{t('yourSecretWord')}</p>
              
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
                    vibrateLight();
                  }
                }}
                onMouseUp={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(false);
                  setTimeout(() => setTarjetaVolteada(false), 50);
                }}
                onMouseLeave={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(false);
                  setTimeout(() => setTarjetaVolteada(false), 50);
                }}
                onTouchStart={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(true);
                  setTarjetaVolteada(true);
                  if (!tarjetaFueVolteada) {
                    setTarjetaFueVolteada(true);
                    vibrateLight();
                  }
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  setTarjetaPresionada(false);
                  setTimeout(() => setTarjetaVolteada(false), 50);
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
                      <p className="instruccion-texto">{t('doNotTell')}</p>
                      <div className="icono-mano">👆</div>
                      <p className="texto-presionar">{t('holdToRevealLine1')}<br />{t('holdToRevealLine2')}</p>
                    </div>
                  </div>
                  <div className="flip-card-back">
                    <div className="tarjeta-palabra">
                      <div className="palabra-revelada palabra-reveal-anim">{palabraMostrar}</div>
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

              {/* Botón "ya vi la palabra" debajo de la tarjeta y arriba de la instrucción */}
              {tarjetaFueVolteada && !todosVieronPalabra && !esUltimoJugador && (
                <button
                  className="btn btn-primary"
                  onClick={handleSiguienteJugador}
                  style={{ width: '100%', fontSize: '1em', padding: '16px 18px', fontWeight: '700', marginTop: '18px' }}
                >
                  ✓ {t('sawWordNextNormal')}
                </button>
              )}
              {tarjetaFueVolteada && esUltimoJugador && (
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    if (!jugadoresQueVieronPalabra.includes(nombreJugador)) {
                      actualizarEstado({ jugadoresQueVieronPalabra: [...jugadoresQueVieronPalabra, nombreJugador] });
                    }
                    setPantalla('quien-empieza');
                  }}
                  style={{ width: '100%', fontSize: '1em', padding: '16px 18px', fontWeight: '700', marginTop: '18px' }}
                >
                  🎮 {t('revealWhoStarts')}
                </button>
              )}

              <p className="instruccion" style={{ marginTop: '14px', fontSize: '0.95em' }}>
                {tarjetaFueVolteada ? t('holdToSee') : t('holdToRevealHint')}
              </p>
            </div>
          </div>
        )}

        </div>
        {/* Zona fija abajo: solo footer y botón cuando todos ya vieron */}
        <div className="contenido-juego-acciones">
        {todosVieronPalabra && (
          <div className="acciones-juego">
            <button
              className="btn btn-primary"
              onClick={() => setPantalla('quien-empieza')}
              style={{ 
                width: '100%', 
                fontSize: '1em', 
                padding: '16px 18px',
                fontWeight: '700'
              }}
            >
              🎮 {t('revealWhoStarts')}
            </button>
          </div>
        )}
        <Footer />
        </div>
      </div>
    </div>
  );
}

export default PantallaJuego;

