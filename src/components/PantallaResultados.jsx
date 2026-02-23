import { iniciarNuevaRonda } from '../utils/iniciarRonda';
import Footer from './Footer';
import ConfettiSutil from './ConfettiSutil';

function PantallaResultados({ estadoJuego, actualizarEstado, setPantalla }) {
  const hayGanador = Boolean(estadoJuego.ganador);

  const nuevoJuegoMismoJugadores = () => {
    // Nuevo juego con los mismos jugadores: regenera palabra, impostor, pistas, etc.
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

  return (
    <div className="pantalla activa" style={{ position: 'relative' }}>
      {hayGanador && <ConfettiSutil />}
      <h2
        id="titulo-resultado"
        className={hayGanador ? 'titulo-ganador' : ''}
      >
        {estadoJuego.ganador
          ? `¡${estadoJuego.ganador} ganó! 🏆`
          : 'Juego Finalizado'}
      </h2>
      <div id="contenido-resultado">
        <div style={{ whiteSpace: 'pre-line', marginBottom: '20px', fontSize: '1.1em' }}>
          {estadoJuego.mensajeResultado}
        </div>
      </div>
      <div className="acciones-resultado" style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={nuevoJuegoMismoJugadores} aria-label="Nuevo juego con los mismos jugadores">
          Nuevo Juego
        </button>
        <button className="btn btn-secondary" onClick={nuevoJuego} aria-label="Volver a la pantalla de inicio">
          Volver al Inicio
        </button>
      </div>
      
      <Footer />
    </div>
  );
}

export default PantallaResultados;

