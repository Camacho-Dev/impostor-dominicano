import { obtenerPalabraAleatoria, generarPistaImpostor } from '../palabras-dominicanas';

function PantallaResultados({ estadoJuego, actualizarEstado, setPantalla }) {
  const siguienteRonda = () => {
    const impostor = Math.floor(Math.random() * estadoJuego.jugadores.length);
    const palabraSecreta = obtenerPalabraAleatoria(estadoJuego.categorias || ['comida']);
    const pistaImpostor = generarPistaImpostor(palabraSecreta);

    // Mantener los jugadores y solo resetear el estado del juego
    actualizarEstado({
      jugadorActual: 0,
      impostor,
      palabraSecreta,
      pistaImpostor,
      pistas: [],
      votos: {},
      jugadoresListos: [],
      jugadorInicia: null,
      modoVotacion: false,
      modoAdivinanza: false,
      modoAcusacion: false,
      mensajeResultado: '',
      ganador: null,
      // NO borrar jugadores, mantenerlos
      // jugadores se mantiene del estado anterior
    });

    setPantalla('juego');
  };

  const nuevoJuego = () => {
    actualizarEstado({
      jugadores: [],
      modosDiabolicos: false,
      modoDiabolicoSeleccionado: null,
      modosAleatorios: false,
      pistas: [],
      votos: {},
      jugadoresListos: [],
      jugadorInicia: null,
      mensajeResultado: '',
      ganador: null
    });
    setPantalla('inicio');
  };

  return (
    <div className="pantalla activa">
      <h2 id="titulo-resultado">
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
        <button className="btn btn-primary" onClick={siguienteRonda}>
          Nuevo Juego
        </button>
        <button className="btn btn-secondary" onClick={nuevoJuego}>
          Volver al Inicio
        </button>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        textAlign: 'center', 
        fontSize: '0.8em', 
        opacity: 0.7,
        color: 'rgba(255, 255, 255, 0.6)'
      }}>
        <p>© 2026 Brayan Camacho. Todos los derechos reservados.</p>
        <p style={{ marginTop: '5px', fontSize: '0.9em' }}>Creado por: <strong>Brayan Camacho</strong></p>
      </div>
    </div>
  );
}

export default PantallaResultados;

