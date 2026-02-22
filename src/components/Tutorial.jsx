import { useState } from 'react';

const TUTORIAL_KEY = 'tutorialCompletado';

const pasos = [
  {
    icono: '🇩🇴',
    titulo: '¡Bienvenido!',
    mensaje: 'Te guiaremos en unos pasos para que empieces a jugar El Impostor Dominicano.'
  },
  {
    icono: '🎯',
    titulo: '1. Selecciona categorías',
    mensaje: 'Elige las categorías de palabras que quieras usar: comida, historia, deportes, etc.'
  },
  {
    icono: '👥',
    titulo: '2. Configura jugadores',
    mensaje: 'Escribe los nombres de cada jugador. Puedes arrastrar para reordenar.'
  },
  {
    icono: '🃏',
    titulo: '3. Ver tu palabra o identidad',
    mensaje: 'En el juego, cada jugador mantiene presionada su tarjeta para ver su palabra secreta o si es el impostor. Suelta para ocultarla.'
  },
  {
    icono: '🎮',
    titulo: '4. ¡A jugar!',
    mensaje: 'Encuentra al impostor o, si eres tú, adivina la palabra sin que te descubran. ¡Lo\' menore\' y su lío!'
  }
];

function Tutorial({ onCompletar }) {
  const [pasoActual, setPasoActual] = useState(0);
  const paso = pasos[pasoActual];
  const esUltimo = pasoActual === pasos.length - 1;

  const handleSiguiente = () => {
    if (esUltimo) {
      try {
        localStorage.setItem(TUTORIAL_KEY, 'true');
      } catch (e) {
        console.warn('No se pudo guardar tutorial completado:', e);
      }
      onCompletar?.();
    } else {
      setPasoActual((p) => Math.min(p + 1, pasos.length - 1));
    }
  };

  const handleOmitir = () => {
    try {
      localStorage.setItem(TUTORIAL_KEY, 'true');
    } catch (e) {
      console.warn('No se pudo guardar tutorial omitido:', e);
    }
    onCompletar?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tutorial-titulo"
      aria-describedby="tutorial-mensaje"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '24px',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #16213e 100%)',
          borderRadius: '20px',
          padding: '32px 28px',
          maxWidth: '420px',
          width: '100%',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
          animation: 'modalEntrada 0.4s ease-out'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '4em', marginBottom: '16px' }}>{paso.icono}</div>
          <h2 id="tutorial-titulo" style={{ fontSize: '1.5em', color: '#fff', marginBottom: '12px' }}>
            {paso.titulo}
          </h2>
          <p id="tutorial-mensaje" style={{ fontSize: '1.05em', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            {paso.mensaje}
          </p>
        </div>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {pasos.map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: i === pasoActual ? '#4ade80' : 'rgba(255,255,255,0.3)',
                transition: 'background 0.3s'
              }}
              aria-hidden="true"
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleSiguiente}
            className="btn btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.1em' }}
            aria-label={esUltimo ? 'Comenzar a jugar' : 'Siguiente paso'}
          >
            {esUltimo ? "¡A jugar! 🎮" : 'Siguiente'}
          </button>
          <button
            onClick={handleOmitir}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.9em',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '8px'
            }}
          >
            Omitir tutorial
          </button>
        </div>
      </div>
    </div>
  );
}

export default Tutorial;
export { TUTORIAL_KEY };
