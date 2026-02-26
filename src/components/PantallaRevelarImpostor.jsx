import { useState } from 'react';
import { iniciarNuevaRonda } from '../utils/iniciarRonda';
import { showInterstitial } from '../services/admob';
import ConfettiSutil from './ConfettiSutil';
import Footer from './Footer';

function PantallaRevelarImpostor({ estadoJuego, actualizarEstado, setPantalla }) {
  const datosInvalidos = !estadoJuego || !estadoJuego.jugadores?.length;

  if (datosInvalidos) {
    return (
      <div className="pantalla activa" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div style={{ fontSize: '3em', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontSize: '1.4em', fontWeight: '700', marginBottom: '12px', textAlign: 'center' }}>
          No se puede mostrar la información
        </h2>
        <p style={{ opacity: 0.7, marginBottom: '28px', textAlign: 'center', lineHeight: '1.5' }}>
          No hay datos de partida. Vuelve al inicio.
        </p>
        <button className="btn btn-primary" onClick={() => setPantalla('inicio')} aria-label="Volver al inicio">
          Volver al inicio
        </button>
      </div>
    );
  }

  let impostorReal = null;
  let titulo = '🎭 El Impostor es:';
  let mostrarResultado = '';
  let emoji = '🎭';

  if (estadoJuego.modoDiabolico === 'todos-impostores') {
    const jugadorConPalabraIndex = estadoJuego.jugadorConPalabra !== undefined ? estadoJuego.jugadorConPalabra : 0;
    const jugadorConPalabra = estadoJuego.jugadores[jugadorConPalabraIndex];
    const impostores = estadoJuego.jugadores.filter((_, index) => index !== jugadorConPalabraIndex);
    titulo = '😈 Modo Diabólico';
    emoji = '😈';
    mostrarResultado = `El jugador con la palabra era: ${jugadorConPalabra}\n\nLos impostores eran:\n${impostores.join('\n')}`;
  } else if (estadoJuego.modoDiabolico === 'todos-impostores-total') {
    titulo = '🔥 ¡Todos eran Impostores!';
    emoji = '🔥';
    mostrarResultado = `¡Todos eran impostores!\n\nNadie tenía la palabra real: ${estadoJuego.palabraSecreta}\n\nJugadores: ${estadoJuego.jugadores.join(', ')}`;
  } else if (estadoJuego.modoDiabolico === 'dos-palabras') {
    titulo = '⚔️ Dos Palabras Secretas';
    emoji = '⚔️';
    const palabra1 = estadoJuego.palabrasJugadores?.[0] || estadoJuego.palabraSecreta;
    const palabra2 = estadoJuego.palabrasJugadores?.[Math.floor(estadoJuego.jugadores.length / 2)] || estadoJuego.palabraSecreta;
    const grupo1 = estadoJuego.jugadores.slice(0, Math.floor(estadoJuego.jugadores.length / 2));
    const grupo2 = estadoJuego.jugadores.slice(Math.floor(estadoJuego.jugadores.length / 2));
    mostrarResultado = `Grupo 1 (${palabra1}):\n${grupo1.join('\n')}\n\nGrupo 2 (${palabra2}):\n${grupo2.join('\n')}`;
  } else if (estadoJuego.modoDiabolico === 'palabras-falsas') {
    titulo = '🎭 Palabras Falsas';
    emoji = '🎭';
    const jugadorCorrecto = estadoJuego.jugadores[estadoJuego.jugadorConPalabra];
    mostrarResultado = `La palabra correcta era: ${estadoJuego.palabraSecreta}\n\nEl único con la palabra correcta era: ${jugadorCorrecto}\n\nLos demás tenían palabras diferentes`;
  } else if (estadoJuego.modoDiabolico === 'multiples-impostores') {
    titulo = '👥 Múltiples Impostores';
    emoji = '👥';
    const impostoresNombres = estadoJuego.impostores?.map(i => estadoJuego.jugadores[i]) || [];
    const normales = estadoJuego.jugadores.filter((_, i) => !estadoJuego.impostores?.includes(i));
    mostrarResultado = `Impostores (${impostoresNombres.length}):\n${impostoresNombres.join('\n')}\n\nJugadores normales:\n${normales.join('\n')}`;
  } else if (estadoJuego.modoDiabolico === 'sin-pistas') {
    impostorReal = estadoJuego.jugadores[estadoJuego.impostor];
    mostrarResultado = `El impostor era: ${impostorReal}\n\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
  } else if (estadoJuego.modoDiabolico === 'pistas-mezcladas') {
    const impostoresNombres = estadoJuego.impostores?.map(i => estadoJuego.jugadores[i]) || [];
    const normales = estadoJuego.jugadores.filter((_, i) => !estadoJuego.impostores?.includes(i));
    titulo = '🎲 Pistas Mezcladas';
    emoji = '🎲';
    mostrarResultado = `La palabra real era: ${estadoJuego.palabraSecreta}\n\nImpostores (con pistas falsas):\n${impostoresNombres.join('\n')}\n\nJugadores normales (con la palabra real):\n${normales.join('\n')}`;
  } else if (estadoJuego.modoDiabolico === 'palabra-compartida') {
    titulo = '🤝 Palabra Compartida';
    emoji = '🤝';
    const falsosImpostores = Object.keys(estadoJuego.pistasImpostores || {}).map(i => estadoJuego.jugadores[parseInt(i, 10)]);
    mostrarResultado = `La palabra era: ${estadoJuego.palabraSecreta}\n\nTodos tenían la misma palabra, pero estos creían ser impostores:\n${falsosImpostores.join('\n')}`;
  } else {
    if (estadoJuego.impostores && estadoJuego.impostores.length > 1) {
      const impostoresNombres = estadoJuego.impostores.map(i => estadoJuego.jugadores[i]);
      const normales = estadoJuego.jugadores.filter((_, i) => !estadoJuego.impostores.includes(i));
      titulo = '🎭 Los Impostores son:';
      emoji = '🎭';
      mostrarResultado = `Impostores (${impostoresNombres.length}):\n${impostoresNombres.join('\n')}\n\nJugadores normales:\n${normales.join('\n')}\n\nLa palabra secreta era:\n${estadoJuego.palabraSecreta || '—'}`;
    } else {
      impostorReal = estadoJuego.jugadores[estadoJuego.impostor];
      mostrarResultado = impostorReal;
    }
  }

  const esModoNormalSimple = !estadoJuego.modoDiabolico && impostorReal;

  // Ganador solo existe si el impostor adivinó la palabra (viene de PantallaAdivinanza)
  const hayGanador = Boolean(estadoJuego?.ganador);

  const [cargandoAnuncio, setCargandoAnuncio] = useState(false);

  const handleNuevaRonda = async () => {
    setCargandoAnuncio(true);
    await showInterstitial();
    setCargandoAnuncio(false);
    const nuevoEstado = iniciarNuevaRonda(estadoJuego);
    actualizarEstado(nuevoEstado);
    setPantalla('juego');
  };

  const handleNuevoJuego = async () => {
    setCargandoAnuncio(true);
    await showInterstitial();
    setCargandoAnuncio(false);
    actualizarEstado({
      jugadores: [],
      modosDiabolicos: false,
      modoDiabolicoSeleccionado: null,
      modosAleatorios: false,
      pistas: [],
      jugadoresListos: [],
      jugadorInicia: null,
      mensajeResultado: '',
      ganador: null
    });
    setPantalla('inicio');
  };

  return (
    <div className="pantalla activa" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {hayGanador && <ConfettiSutil />}

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ width: '80px' }} />
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ fontWeight: '700', fontSize: '1em', color: 'var(--color-text)', opacity: 0.9 }}>
            Resultado
          </span>
        </div>
        <div style={{ width: '80px' }} />
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '28px 20px 24px',
        maxWidth: '520px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* Ganador badge */}
        {hayGanador && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.25) 0%, rgba(251,191,36,0.1) 100%)',
            border: '2px solid rgba(251,191,36,0.5)',
            borderRadius: '20px',
            padding: '8px 20px',
            fontSize: '0.9em',
            fontWeight: '700',
            color: '#fbbf24',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            🏆 ¡{estadoJuego.ganador} ganó! El impostor adivinó la palabra
          </div>
        )}

        {/* Mode badge */}
        {estadoJuego.modoDiabolico && (
          <div style={{
            background: 'rgba(245,87,108,0.15)',
            border: '1px solid rgba(245,87,108,0.3)',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '0.8em',
            fontWeight: '700',
            color: '#f5576c',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Modo Diabólico
          </div>
        )}

        {/* Reveal card */}
        <div style={{
          width: '100%',
          background: esModoNormalSimple
            ? 'linear-gradient(135deg, rgba(245,87,108,0.25) 0%, rgba(245,87,108,0.08) 100%)'
            : 'rgba(255,255,255,0.06)',
          border: esModoNormalSimple
            ? '2px solid rgba(245,87,108,0.5)'
            : '1px solid rgba(255,255,255,0.12)',
          borderRadius: '20px',
          padding: '28px 24px',
          textAlign: 'center',
          marginBottom: '24px',
          boxShadow: esModoNormalSimple ? '0 0 50px rgba(245,87,108,0.15)' : 'none'
        }}>
          <div style={{ fontSize: '2.2em', marginBottom: '10px' }}>{emoji}</div>

          <h3 style={{
            fontSize: '1em',
            fontWeight: '600',
            color: esModoNormalSimple ? '#f5576c' : 'var(--color-text)',
            opacity: esModoNormalSimple ? 1 : 0.7,
            marginBottom: '14px',
            letterSpacing: '0.04em'
          }}>
            {titulo}
          </h3>

          {esModoNormalSimple ? (
            <div>
              <div style={{
                fontSize: 'clamp(1.6em, 8vw, 2.8em)',
                fontWeight: '900',
                color: '#fff',
                textShadow: '0 0 30px rgba(245,87,108,0.6)',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
                marginBottom: '20px',
                wordBreak: 'break-word',
                overflowWrap: 'anywhere'
              }}>
                {mostrarResultado}
              </div>
              {estadoJuego.palabraSecreta && (
                <div style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '14px',
                  padding: '14px 20px'
                }}>
                  <div style={{ fontSize: '0.75em', fontWeight: '600', opacity: 0.6, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                    La palabra secreta era
                  </div>
                  <div style={{
                    fontSize: '1.6em',
                    fontWeight: '900',
                    color: '#fbbf24',
                    textShadow: '0 0 20px rgba(251,191,36,0.4)',
                    letterSpacing: '0.02em'
                  }}>
                    {estadoJuego.palabraSecreta}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              fontSize: '1.05em',
              fontWeight: '500',
              color: 'var(--color-text)',
              opacity: 0.9,
              whiteSpace: 'pre-line',
              lineHeight: '1.8',
              textAlign: 'left'
            }}>
              {mostrarResultado.split('\n').map((line, i) => {
                const isBold = line.endsWith(':') || line.includes('eran:') || line.includes('era:') || line.includes('normales:');
                return (
                  <span key={i} style={{ display: 'block', fontWeight: isBold ? '700' : '400', color: isBold ? '#fbbf24' : 'inherit', marginTop: isBold && i > 0 ? '10px' : '0' }}>
                    {line || '\u00A0'}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
          <button
            onClick={handleNuevaRonda}
            disabled={cargandoAnuncio}
            aria-label="Jugar otra ronda con los mismos jugadores"
            style={{
              width: '100%',
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1.05em',
              fontWeight: '700',
              cursor: cargandoAnuncio ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
              opacity: cargandoAnuncio ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!cargandoAnuncio) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(102,126,234,0.5)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(102,126,234,0.4)';
            }}
          >
            {cargandoAnuncio ? '⏳ Cargando...' : '🔄 Jugar Otra Ronda'}
          </button>

          <button
            onClick={handleNuevoJuego}
            disabled={cargandoAnuncio}
            aria-label="Volver a la pantalla de inicio"
            style={{
              width: '100%',
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              color: 'var(--color-text)',
              fontSize: '1em',
              fontWeight: '600',
              cursor: cargandoAnuncio ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              opacity: cargandoAnuncio ? 0.7 : 1
            }}
            onMouseEnter={(e) => { if (!cargandoAnuncio) e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            🏠 Nuevo Juego
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PantallaRevelarImpostor;
