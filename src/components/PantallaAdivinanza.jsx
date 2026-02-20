import { useState } from 'react';

function PantallaAdivinanza({ estadoJuego, actualizarEstado, setPantalla }) {
  const [adivinanza, setAdivinanza] = useState('');

  const handleConfirmar = () => {
    const adivinanzaLower = adivinanza.trim().toLowerCase();
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
        onChange={(e) => setAdivinanza(e.target.value)}
        placeholder="Escribe aquí..."
        autoComplete="off"
        onKeyPress={(e) => e.key === 'Enter' && handleConfirmar()}
        style={{ 
          width: '100%', 
          padding: '15px', 
          fontSize: '1.2em',
          margin: '20px 0',
          borderRadius: '10px',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          background: 'rgba(255, 255, 255, 0.1)',
          color: '#fff'
        }}
      />
      <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={handleConfirmar}>
          Confirmar
        </button>
        <button className="btn btn-secondary" onClick={() => setPantalla('juego')}>
          Cancelar
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

export default PantallaAdivinanza;

