import { obtenerPalabraAleatoria, generarPistaImpostor, generarPistasImpostores } from '../palabras-dominicanas';

/**
 * Genera el estado completo para una nueva ronda del juego.
 * Mantiene jugadores, categorías y configuración de modos.
 */
export function iniciarNuevaRonda(estadoJuego, numImpostoresOverride) {
  const jugadores = estadoJuego.jugadores || [];
  const categorias = estadoJuego.categorias || ['comida'];
  const modoDiabolico = estadoJuego.modosDiabolicos && estadoJuego.modoDiabolicoSeleccionado;
  const numImpostores = numImpostoresOverride ?? estadoJuego.numImpostores ?? 1;

  const palabraSecreta = obtenerPalabraAleatoria(categorias);
  let impostor = null;
  let pistaImpostor = null;
  let pistasImpostores = {};
  let jugadorConPalabra = null;
  let palabrasJugadores = {};
  let impostores = [];

  if (modoDiabolico === 'todos-impostores') {
    jugadorConPalabra = Math.floor(Math.random() * jugadores.length);
    const pistas = generarPistasImpostores(palabraSecreta, jugadores.length - 1);
    let indicePista = 0;
    for (let i = 0; i < jugadores.length; i++) {
      if (i !== jugadorConPalabra) {
        pistasImpostores[i] = pistas[indicePista++];
      }
    }
  } else if (modoDiabolico === 'todos-impostores-total') {
    const pistas = generarPistasImpostores(palabraSecreta, jugadores.length);
    jugadores.forEach((_, i) => { pistasImpostores[i] = pistas[i]; });
  } else if (modoDiabolico === 'dos-palabras') {
    const palabra1 = obtenerPalabraAleatoria(categorias);
    const palabra2 = obtenerPalabraAleatoria(categorias);
    const mitad = Math.floor(jugadores.length / 2);
    jugadores.forEach((_, i) => {
      palabrasJugadores[i] = i < mitad ? palabra1 : palabra2;
    });
  } else if (modoDiabolico === 'palabras-falsas') {
    const indiceCorrecto = Math.floor(Math.random() * jugadores.length);
    jugadores.forEach((_, i) => {
      palabrasJugadores[i] = i === indiceCorrecto
        ? palabraSecreta
        : obtenerPalabraAleatoria(categorias);
    });
    jugadorConPalabra = indiceCorrecto;
  } else if (modoDiabolico === 'multiples-impostores') {
    const cantidad = Math.max(2, Math.floor(jugadores.length * (0.3 + Math.random() * 0.2)));
    const indices = [...Array(jugadores.length).keys()];
    for (let i = 0; i < cantidad; i++) {
      impostores.push(indices.splice(Math.floor(Math.random() * indices.length), 1)[0]);
    }
    const pistas = generarPistasImpostores(palabraSecreta, impostores.length);
    impostores.forEach((idx, i) => { pistasImpostores[idx] = pistas[i]; });
  } else if (modoDiabolico === 'sin-pistas') {
    impostor = Math.floor(Math.random() * jugadores.length);
  } else if (modoDiabolico === 'pistas-mezcladas') {
    const cantidad = Math.max(1, Math.floor(jugadores.length / 2));
    const indices = [...Array(jugadores.length).keys()];
    for (let i = 0; i < cantidad; i++) {
      impostores.push(indices.splice(Math.floor(Math.random() * indices.length), 1)[0]);
    }
    impostores.forEach((idx) => {
      pistasImpostores[idx] = generarPistaImpostor(obtenerPalabraAleatoria(categorias));
    });
    impostor = impostores[0];
  } else if (modoDiabolico === 'palabra-compartida') {
    const cantidadFalsos = Math.floor(jugadores.length / 3);
    const indices = [...Array(jugadores.length).keys()];
    const indicesFalsos = [];
    for (let i = 0; i < cantidadFalsos; i++) {
      indicesFalsos.push(indices.splice(Math.floor(Math.random() * indices.length), 1)[0]);
    }
    const pistas = generarPistasImpostores(palabraSecreta, indicesFalsos.length);
    indicesFalsos.forEach((idx, i) => { pistasImpostores[idx] = pistas[i]; });
  } else {
    const cantidad = Math.min(numImpostores, Math.max(1, Math.floor(jugadores.length / 2)));
    if (cantidad === 1) {
      impostor = Math.floor(Math.random() * jugadores.length);
      pistaImpostor = generarPistaImpostor(palabraSecreta);
    } else {
      impostores = [...Array(jugadores.length).keys()]
        .sort(() => Math.random() - 0.5)
        .slice(0, cantidad);
      const pistas = generarPistasImpostores(palabraSecreta, cantidad);
      impostores.forEach((idx, i) => { pistasImpostores[idx] = pistas[i]; });
      impostor = impostores[0];
    }
  }

  return {
    jugadorActual: 0,
    impostor,
    palabraSecreta,
    pistaImpostor,
    pistasImpostores,
    modoDiabolico,
    jugadorConPalabra,
    palabrasJugadores,
    impostores,
    pistas: [],
    jugadoresListos: [],
    jugadorInicia: null,
    modoAdivinanza: false,
    modoAcusacion: false,
    mensajeResultado: '',
    ganador: null,
    jugadoresQueVieronPalabra: [],
  };
}
