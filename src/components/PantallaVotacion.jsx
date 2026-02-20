import { useState, useEffect } from 'react';

function PantallaVotacion({ estadoJuego, actualizarEstado, setPantalla }) {
  const [votoSeleccionado, setVotoSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
  const jugadoresDisponibles = estadoJuego.jugadores.filter(j => j !== nombreJugador);

  useEffect(() => {
    if (!estadoJuego.votos) {
      actualizarEstado({ votos: {} });
    }
  }, []);

  const handleVotar = (jugadorVotado) => {
    setVotoSeleccionado(jugadorVotado);
    const nuevosVotos = { ...estadoJuego.votos, [nombreJugador]: jugadorVotado };
    actualizarEstado({ votos: nuevosVotos });

    // Verificar si todos votaron
    setTimeout(() => {
      if (Object.keys(nuevosVotos).length === estadoJuego.jugadores.length) {
        setMostrarResultados(true);
      } else {
        // Continuar con el siguiente jugador
        const siguienteJugador = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
        actualizarEstado({ jugadorActual: siguienteJugador });
        setPantalla('votacion');
      }
    }, 1000);
  };

  const procesarResultados = () => {
    const conteoVotos = {};
    estadoJuego.jugadores.forEach(jugador => {
      conteoVotos[jugador] = 0;
    });

    Object.values(estadoJuego.votos).forEach(votado => {
      conteoVotos[votado] = (conteoVotos[votado] || 0) + 1;
    });

    const maxVotos = Math.max(...Object.values(conteoVotos));
    const jugadoresVotados = Object.entries(conteoVotos)
      .filter(([_, votos]) => votos === maxVotos)
      .map(([jugador, _]) => jugador);

    const jugadorVotado = jugadoresVotados[0];
    const indiceVotado = estadoJuego.jugadores.indexOf(jugadorVotado);
    const esImpostor = indiceVotado === estadoJuego.impostor;

    let mensaje = '';
    const nuevasPuntuaciones = { ...estadoJuego.puntuaciones };

    if (esImpostor) {
      mensaje = `¡El impostor ${jugadorVotado} fue descubierto! 🎯`;
      mensaje += `\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
      
      estadoJuego.jugadores.forEach((jugador, index) => {
        if (index !== estadoJuego.impostor) {
          nuevasPuntuaciones[jugador] = (nuevasPuntuaciones[jugador] || 0) + 10;
        }
      });
    } else {
      mensaje = `¡Votaron a un inocente! 😈`;
      mensaje += `\nEl impostor era: ${estadoJuego.jugadores[estadoJuego.impostor]}`;
      mensaje += `\nLa palabra secreta era: ${estadoJuego.palabraSecreta}`;
      
      nuevasPuntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] = 
        (nuevasPuntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] || 0) + 15;
    }

    actualizarEstado({ puntuaciones: nuevasPuntuaciones });
    
    setTimeout(() => {
      setPantalla('resultados');
      actualizarEstado({ 
        mensajeResultado: mensaje,
        ganador: esImpostor ? null : estadoJuego.jugadores[estadoJuego.impostor]
      });
    }, 3000);
  };

  useEffect(() => {
    if (mostrarResultados) {
      procesarResultados();
    }
  }, [mostrarResultados]);

  if (mostrarResultados) {
    const conteoVotos = {};
    estadoJuego.jugadores.forEach(jugador => {
      conteoVotos[jugador] = 0;
    });
    Object.values(estadoJuego.votos || {}).forEach(votado => {
      conteoVotos[votado] = (conteoVotos[votado] || 0) + 1;
    });

    return (
      <div className="pantalla activa">
        <h2>🗳️ Resultados de la Votación</h2>
        <div className="resultados-votacion">
          <h3>Conteo de Votos:</h3>
          {Object.entries(conteoVotos).map(([jugador, votos]) => (
            <div key={jugador} className="resultado-voto">
              <span>{jugador}</span>
              <span>{votos} voto(s)</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pantalla activa">
      <h2>🗳️ Votación</h2>
      <p className="instruccion-votacion">
        Votación - Turno de: {nombreJugador}
      </p>
      <p className="instruccion-votacion" style={{ fontSize: '0.9em', opacity: 0.8 }}>
        Vota por quién crees que es el impostor:
      </p>
      <div className="lista-votos">
        {jugadoresDisponibles.map((jugador, index) => (
          <div
            key={index}
            className={`voto-item ${votoSeleccionado === jugador ? 'seleccionado' : ''}`}
            onClick={() => handleVotar(jugador)}
          >
            {jugador}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PantallaVotacion;


