import { useState } from 'react';

function PantallaAcusacion({ estadoJuego, actualizarEstado, setPantalla }) {
  const [seleccionado, setSeleccionado] = useState(null);
  const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
  const jugadoresDisponibles = estadoJuego.jugadores.filter(j => j !== nombreJugador);

  const handleAcusar = (jugadorAcusado) => {
    setSeleccionado(jugadorAcusado);
    const indiceAcusado = estadoJuego.jugadores.indexOf(jugadorAcusado);
    const esImpostor = indiceAcusado === estadoJuego.impostor;
    
    const nuevasPuntuaciones = { ...estadoJuego.puntuaciones };
    let mensaje = '';

    if (esImpostor) {
      mensaje = `¡${nombreJugador} acusó correctamente al impostor! 🎯`;
      mensaje += `\nEl impostor era: ${jugadorAcusado}`;
      mensaje += `\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
      nuevasPuntuaciones[nombreJugador] = (nuevasPuntuaciones[nombreJugador] || 0) + 15;
    } else {
      mensaje = `¡${nombreJugador} acusó a un inocente! 😈`;
      mensaje += `\nEl impostor era: ${estadoJuego.jugadores[estadoJuego.impostor]}`;
      mensaje += `\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
      nuevasPuntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] = 
        (nuevasPuntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] || 0) + 10;
    }

    actualizarEstado({ 
      puntuaciones: nuevasPuntuaciones,
      mensajeResultado: mensaje,
      ganador: esImpostor ? nombreJugador : null
    });

    setTimeout(() => setPantalla('resultados'), 400);
  };

  return (
    <div className="pantalla activa">
      <h2>👆 Acusar a un Jugador</h2>
      <p>Selecciona a quién quieres acusar:</p>
      <div className="lista-acusaciones">
        {jugadoresDisponibles.map((jugador, index) => (
          <button
            type="button"
            key={jugador}
            className={`acusacion-item ${seleccionado === jugador ? 'seleccionado' : ''}`}
            onClick={() => !seleccionado && handleAcusar(jugador)}
            aria-pressed={seleccionado === jugador}
            aria-label={`Acusar a ${jugador}`}
          >
            <span>{jugador}</span>
            {seleccionado === jugador && <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>✓</span>}
          </button>
        ))}
      </div>
      <button className="btn btn-secondary" onClick={() => setPantalla('juego')} aria-label="Cancelar y volver al juego">
        Cancelar
      </button>
    </div>
  );
}

export default PantallaAcusacion;




