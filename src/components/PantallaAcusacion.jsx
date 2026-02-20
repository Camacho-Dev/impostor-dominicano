import { useState } from 'react';

function PantallaAcusacion({ estadoJuego, actualizarEstado, setPantalla }) {
  const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
  const jugadoresDisponibles = estadoJuego.jugadores.filter(j => j !== nombreJugador);

  const handleAcusar = (jugadorAcusado) => {
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

    setPantalla('resultados');
  };

  return (
    <div className="pantalla activa">
      <h2>👆 Acusar a un Jugador</h2>
      <p>Selecciona a quién quieres acusar:</p>
      <div className="lista-acusaciones">
        {jugadoresDisponibles.map((jugador, index) => (
          <div
            key={index}
            className="acusacion-item"
            onClick={() => handleAcusar(jugador)}
          >
            {jugador}
          </div>
        ))}
      </div>
      <button className="btn btn-secondary" onClick={() => setPantalla('juego')}>
        Cancelar
      </button>
    </div>
  );
}

export default PantallaAcusacion;

