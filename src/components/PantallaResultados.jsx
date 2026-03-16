import { useEffect } from 'react';
import { iniciarNuevaRonda } from '../utils/iniciarRonda';
import { useLanguage } from '../context/LanguageContext';
import { vibrateSuccess } from '../utils/vibration';
import Footer from './Footer';
import ConfettiSutil from './ConfettiSutil';

function PantallaResultados({ estadoJuego, actualizarEstado, setPantalla }) {
  const { t } = useLanguage();
  const hayGanador = Boolean(estadoJuego?.ganador);

  useEffect(() => {
    if (hayGanador) vibrateSuccess();
  }, [hayGanador]);
  const tieneDatosResultado = estadoJuego && estadoJuego.jugadores?.length &&
    (estadoJuego.mensajeResultado != null || estadoJuego.ganador != null);
  const datosInvalidos = !tieneDatosResultado;

  const nuevoJuegoMismoJugadores = () => {
    const nuevoEstado = iniciarNuevaRonda(estadoJuego);
    actualizarEstado(nuevoEstado);
    setPantalla('juego');
  };

  const nuevoJuego = () => {
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

  if (datosInvalidos) {
    return (
      <div className="pantalla activa" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '24px' }}>
        <div style={{ fontSize: '3em', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontSize: '1.4em', fontWeight: '700', marginBottom: '12px', textAlign: 'center' }}>
          {t('noResults')}
        </h2>
        <p style={{ opacity: 0.7, marginBottom: '28px', textAlign: 'center', lineHeight: '1.5' }}>
          {t('noResultsDesc')}
        </p>
        <button
          className="btn btn-primary"
          onClick={() => { actualizarEstado({ jugadores: [], mensajeResultado: '', ganador: null }); setPantalla('inicio'); }}
          aria-label={t('backToStart')}
          style={{ minWidth: '180px' }}
        >
          {t('backToStart')}
        </button>
      </div>
    );
  }

  return (
    <div className="pantalla activa" style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {hayGanador && <ConfettiSutil />}

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px 24px',
        maxWidth: '500px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box'
      }}>

        {/* Trophy / outcome icon */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: hayGanador
            ? 'linear-gradient(135deg, rgba(251,191,36,0.35) 0%, rgba(251,191,36,0.1) 100%)'
            : 'linear-gradient(135deg, rgba(102,126,234,0.35) 0%, rgba(102,126,234,0.1) 100%)',
          border: hayGanador
            ? '2px solid rgba(251,191,36,0.6)'
            : '2px solid rgba(102,126,234,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2.4em',
          marginBottom: '20px',
          boxShadow: hayGanador ? '0 0 40px rgba(251,191,36,0.25)' : 'none'
        }}>
          {hayGanador ? '🏆' : '🎭'}
        </div>

        {/* Title */}
        <h2
          id="titulo-resultado"
          style={{
            fontSize: hayGanador ? '2em' : '1.6em',
            fontWeight: '800',
            textAlign: 'center',
            marginBottom: '8px',
            color: hayGanador ? '#fbbf24' : 'var(--color-text)',
            textShadow: hayGanador ? '0 0 30px rgba(251,191,36,0.5)' : 'none',
            lineHeight: '1.2'
          }}
        >
          {estadoJuego.ganador
            ? `¡${estadoJuego.ganador} ${t('won')}`
            : t('gameOver')}
        </h2>

        {hayGanador && (
          <p style={{ opacity: 0.75, marginBottom: '24px', fontSize: '0.95em' }}>
            El impostor adivinó la palabra secreta
          </p>
        )}

        {/* Result card */}
        <div style={{
          width: '100%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '18px',
          padding: '24px',
          marginBottom: '32px',
          marginTop: hayGanador ? '0' : '16px'
        }}>
          <div
            id="contenido-resultado"
            style={{
              whiteSpace: 'pre-line',
              fontSize: '1.05em',
              lineHeight: '1.7',
              color: 'var(--color-text)',
              opacity: 0.9,
              textAlign: 'center'
            }}
          >
            {estadoJuego.mensajeResultado}
          </div>
        </div>

        {/* Action buttons */}
        <div
          className="acciones-resultado"
          style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}
        >
          <button
            onClick={nuevoJuegoMismoJugadores}
            aria-label={t('newGameSamePlayers')}
            style={{
              width: '100%',
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#fff',
              fontSize: '1.05em',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(102,126,234,0.4)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(102,126,234,0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(102,126,234,0.4)';
            }}
          >
            🔄 {t('newGameSamePlayers')}
          </button>

          <button
            onClick={nuevoJuego}
            aria-label={t('backToStart')}
            style={{
              width: '100%',
              padding: '16px 24px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '14px',
              color: 'var(--color-text)',
              fontSize: '1em',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            🏠 {t('newGame')}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PantallaResultados;
