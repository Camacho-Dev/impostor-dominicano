/**
 * Preguntas y respuestas del asistente "Los Menores y Su Lío".
 * Solo responde a estas preguntas; el resto recibe una respuesta genérica en dominicano.
 * Las claves de cada entrada son variantes de la misma pregunta (para matchear).
 */

function normalizar(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ');
}

export function buscarRespuesta(mensaje) {
  const msg = normalizar(mensaje);
  if (!msg) return null;

  for (const bloque of RESPUESTAS) {
    for (const pregunta of bloque.preguntas) {
      const p = normalizar(pregunta);
      if (msg === p || msg.includes(p) || (p.length >= 5 && p.includes(msg))) return bloque.respuesta;
    }
  }
  return null;
}

/** Respuesta cuando no hay match */
export const RESPUESTA_DEFAULT = "¡Ay, eso no me lo han preguntao todavía, tigre! 😅 Dale, prueba con algo como: \"¿Cómo se juega?\" o \"¿Qué es el impostor?\" que de esa vaina sí tengo la data.";

/** Mensaje de bienvenida del canal */
export const MENSAJE_BIENVENIDA = "¡Qué lo qué! Soy el asistente de Lo' Menore' y Su Lío 🇩🇴 Escribe tu pregunta y te ayudo con la vaina del juego. Dale, no seas tímido.";

const RESPUESTAS = [
  {
    preguntas: [
      'como se juega',
      'como juego',
      'como se juega esto',
      'explicame el juego',
      'que hay que hacer',
      'reglas del juego',
      'como funciona',
    ],
    respuesta: "Mira, es fácil: todos tienen una palabra dominicana secreta menos el impostor (o los impostores). Los normales dan pistas sin decir la palabra; el impostor se hace el vivo y trata de adivinar o de que voten por otro. Cuando todos pasen, votan o acusan. Si cazan al impostor, ganan los normales; si no, gana el impostor. ¡Eso e\' la vaina!",
  },
  {
    preguntas: [
      'que es el impostor',
      'quien es el impostor',
      'que hace el impostor',
      'el impostor',
    ],
    respuesta: "El impostor es el que NO tiene la palabra secreta, o sea que está en la oscurana. Su trabajo es hacerte creer que sí la tiene, dar pistas que no delaten, y o adivinar la palabra o hacer que voten por un inocente. Si lo logra, se lleva el round. ¡Un tiguere!",
  },
  {
    preguntas: [
      'cuantos jugadores',
      'cuantos pueden jugar',
      'minimo de jugadores',
      'maximo de jugadores',
      'cuantos somos',
    ],
    respuesta: "Dale, mínimo 3 jugadores y máximo 10. Con 3 es un lío chiquito; con 10 se pone la cosa buena. Tú mete a tu gente y a jugar.",
  },
  {
    preguntas: [
      'modos diabolicos',
      'que son los modos diabolicos',
      'modo diabolico',
      'que es modo diabolico',
    ],
    respuesta: "Esos son los modos que ponen la cosa fierce. Hay de todo: todos impostores menos uno, dos palabras secretas, sin pistas, pistas mezcladas, palabra fantasma, modo espejo... Activa uno y verás el desastre. ¡Pa\' que no digan que el juego es fácil!",
  },
  {
    preguntas: [
      'categorias',
      'que son las categorias',
      'que categorias hay',
      'palabras de que',
    ],
    respuesta: "Las categorías son de dónde salen las palabras: comida dominicana, música, lugares, personajes, youtubers, barrios, tradiciones y más. Tú eliges una o varias; entre más mezcles, más variado. Todo bien dominicano.",
  },
  {
    preguntas: [
      'como gana el impostor',
      'que tiene que hacer el impostor para ganar',
      'como gana impostor',
    ],
    respuesta: "El impostor gana si: 1) Adivina la palabra secreta, o 2) Hacen que voten por alguien que no es impostor (un inocente). Ahí se lleva el round. Si lo cazan antes, pierde.",
  },
  {
    preguntas: [
      'como ganan los normales',
      'como ganan los que no son impostor',
      'como gana el equipo',
    ],
    respuesta: "Los normales ganan cuando votan y le atinan al impostor, o cuando alguien acusa y da en el clavo. Si el impostor no adivina la palabra y lo cazan, ustedes ganan. ¡A coordinar!",
  },
  {
    preguntas: [
      'pista al impostor',
      'que es la pista al impostor',
      'el impostor tiene pista',
      'mostrar pista impostor',
    ],
    respuesta: "Esa opción es pa\' que el impostor reciba una pista de la palabra (sin decirle la palabra). Si la apagas, juega a ciegas, más difícil. Si la prendes, tiene un chin de ayuda. Tú ves cómo quieren jugar.",
  },
  {
    preguntas: [
      'sin internet',
      'funciona sin internet',
      'offline',
      'sin conexion',
      'sin datos',
    ],
    respuesta: "Sí, fiero. Una vez que cargaste la app, el juego corre sin internet. Las palabras y todo están ahí. Lo que sí puede fallar sin datos es lo de anuncios o alguna cosa de cuenta, pero jugar jugar, va bien.",
  },
  {
    preguntas: [
      "los menores y su lio",
      "lo menore y su lio",
      "menores y su lio",
      "que es lo menore",
      "nombre del juego",
    ],
    respuesta: "¡Eso e\' nosotros! Lo\' Menore\' y Su Lío es la vaina del juego: un lío entre amigos tratando de cazar al impostor con palabras bien dominicanas. Dale, a jugar.",
  },
  {
    preguntas: [
      'quien empieza',
      'quien inicia',
      'como saben quien habla primero',
    ],
    respuesta: "Cuando todos ven su palabra, el juego elige al azar quién empieza la conversación. Ese da la primera pista y de ahí siguen. Nadie se salta el orden.",
  },
  {
    preguntas: [
      'votar',
      'como se vota',
      'acusar',
      'diferencia entre votar y acusar',
    ],
    respuesta: "Votar es cuando todos eligen a quién creen que es el impostor; si la mayoría le atina, ganan. Acusar es cuando tú solo acusas a alguien: si le atinas, ganan; si no, el impostor gana. La acusación es más arriesgada pero más rápida.",
  },
  {
    preguntas: [
      'que palabras hay',
      'de que son las palabras',
      'palabras dominicanas',
      'ejemplos de palabras',
    ],
    respuesta: "De todo lo nuestro: mangú, sancocho, tigueraje, qué lo qué, Juan Luis Guerra, Licey, carnaval, larimar, colmado... Por categorías. Entre más categorías elijas, más variedad.",
  },
  {
    preguntas: [
      'hola',
      'que lo que',
      'klk',
      'saludos',
      'hey',
      'buenas',
    ],
    respuesta: "¡Qué lo qué! ¿En qué te puedo ayudar con el juego? Pregunta lo que sea.",
  },
  {
    preguntas: [
      'gracias',
      'dale',
      'ok',
      'perfecto',
      'entendido',
    ],
    respuesta: "De na\', tigre. ¡A echar la partida! 🇩🇴",
  },
];
