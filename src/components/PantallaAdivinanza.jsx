import { useState } from 'react';
import { useNotificaciones } from '../context/NotificacionesContext';
import Footer from './Footer';

function PantallaAdivinanza({ estadoJuego, actualizarEstado, setPantalla }) {
  const { showToast } = useNotificaciones();
  const [adivinanza, setAdivinanza] = useState('');
  const [error, setError] = useState('');

  const handleConfirmar = () => {
    const adivinanzaLower = adivinanza.trim().toLowerCase();
    if (!adivinanzaLower) {
      setError('Escribe una palabra para adivinar');
      showToast('Escribe una palabra para adivinar', 'info');
      return;
    }
    setError('');
    const palabraCorrecta = estadoJuego.palabraSecreta.toLowerCase();
    
    let mensaje = '';
    let ganador = null;

    if (adivinanzaLower === palabraCorrecta) {
      mensaje = `¡El impostor ${estadoJuego.jugadores[estadoJuego.impostor]} adivinó la palabra! 🎯`;
      ganador = estadoJuego.jugadores[estadoJuego.impostor];
    } else {
      mensaje = `¡El impostor falló al adivinar! ❌`;
    }

    actualizarEstado({ 
      mensajeResultado: mensaje,
      ganador
    });

    setPantalla('resultados');
  };

  return (
    <div className="pantalla activa">
      <h2>🎯 Adivinar la Palabra</h2>
      <p>Escribe la palabra que crees que es la secreta:</p>
      <input
        type="text"
        value={adivinanza}
        onChange={(e) => {
          setAdivinanza(e.target.value);
          if (error) setError('');
        }}
        placeholder="Escribe aquí..."
        autoComplete="off"
        aria-label="Escribe la palabra secreta que crees que es"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'adivinanza-error' : undefined}
        onKeyDown={(e) => e.key === 'Enter' && handleConfirmar()}
        style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '1.2em',
          margin: '20px 0',
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: 'var(--color-text)'
        }}
      />
      {error && (
        <p id="adivinanza-error" role="alert" style={{ color: 'var(--color-danger)', marginTop: '-8px', marginBottom: '12px', fontSize: '0.95em' }}>
          {error}
        </p>
      )}
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={handleConfirmar} aria-label="Confirmar adivinanza">
          Confirmar
        </button>
        <button className="btn btn-secondary" onClick={() => setPantalla('juego')} aria-label="Cancelar y volver al juego">
          Cancelar
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default PantallaAdivinanza;

