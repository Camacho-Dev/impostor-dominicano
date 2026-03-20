function isPlainObject(v) {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function isInteger(n) {
  return Number.isInteger(n);
}

function scanArrayOfStrings(label, arr, warnings) {
  if (!Array.isArray(arr)) {
    warnings.push(`[scan:${label}] debería ser array, pero es ${typeof arr}`);
    return;
  }
  // No forzamos que todos sean strings; solo avisamos si hay elementos “raros”
  const bad = arr.filter((x) => typeof x !== 'string');
  if (bad.length > 0) {
    warnings.push(`[scan:${label}] contiene ${bad.length} elementos no-string`);
  }
}

function scanIndicesInRange(label, indices, maxExclusive, warnings) {
  if (!Array.isArray(indices)) {
    warnings.push(`[scan:${label}] debería ser array, pero es ${typeof indices}`);
    return;
  }
  for (const idx of indices) {
    if (!isInteger(idx)) {
      warnings.push(`[scan:${label}] índice no es entero: ${String(idx)}`);
      continue;
    }
    if (idx < 0 || idx >= maxExclusive) {
      warnings.push(`[scan:${label}] índice fuera de rango: ${idx} (0..${maxExclusive - 1})`);
    }
  }
}

export function scanGameState({ pantalla, estadoJuego }) {
  const warnings = [];

  if (!estadoJuego) {
    warnings.push('[scan] estadoJuego es null/undefined');
    return warnings;
  }
  if (!isPlainObject(estadoJuego)) {
    warnings.push('[scan] estadoJuego no es un objeto plano');
    return warnings;
  }

  const jugadores = estadoJuego.jugadores;
  const categorias = estadoJuego.categorias;
  const jugadorActual = estadoJuego.jugadorActual;
  const palabraSecreta = estadoJuego.palabraSecreta;
  // Preferimos el valor calculado en iniciarNuevaRonda (estadoJuego.modoDiabolico)
  const modoDiabolico = estadoJuego.modoDiabolico !== undefined
    ? estadoJuego.modoDiabolico
    : (estadoJuego.modosDiabolicos ? estadoJuego.modoDiabolicoSeleccionado : false);

  const totalJugadores = Array.isArray(jugadores) ? jugadores.length : 0;

  const pantallasJuego = new Set([
    'inicio',
    'jugadores',
    'juego',
    'revelar-impostor',
    'resultados',
    'quien-empieza',
    'premium'
  ]);

  if (pantalla && !pantallasJuego.has(pantalla)) {
    warnings.push(`[scan] pantalla desconocida: ${String(pantalla)}`);
  }

  if (['jugadores', 'juego', 'revelar-impostor', 'resultados', 'quien-empieza'].includes(pantalla)) {
    if (!Array.isArray(jugadores)) warnings.push('[scan] estadoJuego.jugadores no es array');
    if (Array.isArray(jugadores) && jugadores.length < 3) warnings.push('[scan] jugadores < 3 en pantalla de juego');
  }

  if (pantalla === 'juego') {
    if (!isInteger(jugadorActual)) warnings.push('[scan] jugadorActual no es entero en pantalla juego');
    if (isInteger(jugadorActual) && Array.isArray(jugadores) && (jugadorActual < 0 || jugadorActual >= jugadores.length)) {
      warnings.push(`[scan] jugadorActual fuera de rango: ${jugadorActual}`);
    }
    if (!Array.isArray(categorias) || categorias.length === 0) warnings.push('[scan] categorias vacías en pantalla juego');

    // palabraSecreta puede ser vacía en algunos modos raros, pero como base debería existir
    if (!isNonEmptyString(palabraSecreta)) {
      // Si el modo usa palabras por jugador, toleramos que palabraSecreta esté vacía
      const usaPalabrasPorJugador = ['dos-palabras', 'rotacion-palabras', 'modo-espejo', 'palabra-fantasma'].includes(modoDiabolico);
      if (!usaPalabrasPorJugador) {
        warnings.push('[scan] palabraSecreta está vacía en modo que normalmente la necesita');
      }
    }

    // Verificar vista palabra de jugadores (se usa para avanzar)
    const vistos = estadoJuego.jugadoresQueVieronPalabra;
    if (vistos != null) {
      if (!Array.isArray(vistos)) warnings.push('[scan] jugadoresQueVieronPalabra no es array');
    }
  }

  if (pantalla === 'revelar-impostor') {
    if (!Array.isArray(jugadores) || jugadores.length < 1) warnings.push('[scan] revelación sin jugadores');
    // mensajeResultado/ganador normalmente se usan en resultados, pero aquí avisamos si falta información base
    if (!isNonEmptyString(palabraSecreta) && !['dos-palabras', 'rotacion-palabras', 'modo-espejo'].includes(modoDiabolico)) {
      warnings.push('[scan] palabraSecreta vacía en revelar-impostor');
    }
  }

  if (pantalla === 'resultados') {
    const mensajeResultado = estadoJuego.mensajeResultado;
    const ganador = estadoJuego.ganador;
    if (mensajeResultado == null || (typeof mensajeResultado === 'string' && mensajeResultado.trim() === '')) {
      warnings.push('[scan] mensajeResultado vacío en resultados');
    }
    // ganador puede ser null en game over; solo avisamos si ambos están mal
    if (ganador != null && typeof ganador !== 'string') warnings.push('[scan] ganador no es string');
  }

  // Validaciones genéricas que no dependen tanto de pantalla
  if (estadoJuego.impostores != null) {
    if (Array.isArray(estadoJuego.impostores)) {
      if (Array.isArray(jugadores) && totalJugadores > 0) {
        scanIndicesInRange('impostores', estadoJuego.impostores, totalJugadores, warnings);
      }
    } else {
      warnings.push('[scan] estadoJuego.impostores no es array');
    }
  }

  if (estadoJuego.pistasImpostores != null) {
    if (!isPlainObject(estadoJuego.pistasImpostores) && !Array.isArray(estadoJuego.pistasImpostores)) {
      warnings.push('[scan] estadoJuego.pistasImpostores no es objeto/array');
    }
  }

  if (estadoJuego.palabrasJugadores != null) {
    if (!isPlainObject(estadoJuego.palabrasJugadores)) {
      warnings.push('[scan] estadoJuego.palabrasJugadores no es objeto (se esperan índices -> palabra)');
    }
    // si es objeto, validar valores cuando existan
    if (isPlainObject(estadoJuego.palabrasJugadores)) {
      const vals = Object.values(estadoJuego.palabrasJugadores).slice(0, 12);
      if (vals.some((v) => v != null && typeof v !== 'string')) {
        warnings.push('[scan] palabrasJugadores contiene valores no-string');
      }
    }
  }

  // Avisos de arrays clave
  if (estadoJuego.jugadoresListos != null) {
    scanArrayOfStrings('jugadoresListos', estadoJuego.jugadoresListos, warnings);
  }

  return warnings;
}

