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

/** Distancia de Levenshtein: número de ediciones (insertar, borrar, sustituir) para ir de a a b. */
function distanciaLevenshtein(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[b.length][a.length];
}

/** Cuántos typos permitir según la longitud del mensaje (como una persona que entiende el contexto). */
function maxTyposPermitidos(len) {
  if (len <= 4) return 1;
  if (len <= 8) return 2;
  return Math.min(4, Math.max(2, Math.ceil(len * 0.15)));
}

export function buscarRespuesta(mensaje) {
  const msg = normalizar(mensaje);
  if (!msg) return null;

  // 1) Match exacto o por inclusión (como antes)
  for (const bloque of RESPUESTAS) {
    for (const pregunta of bloque.preguntas) {
      const p = normalizar(pregunta);
      if (msg === p || msg.includes(p) || (p.length >= 5 && p.includes(msg))) return bloque.respuesta;
    }
  }

  // 2) Si no hay match, buscar la pregunta más parecida (tolera typos: holq -> hola, jugarr -> jugar)
  let mejorDistancia = Infinity;
  let mejorBloque = null;
  const maxTypos = maxTyposPermitidos(msg.length);

  for (const bloque of RESPUESTAS) {
    for (const pregunta of bloque.preguntas) {
      const p = normalizar(pregunta);
      // Solo comparar si las longitudes son parecidas (evitar match de "hola" con "como gana el impostor")
      if (Math.abs(msg.length - p.length) > maxTypos + 2) continue;
      const d = distanciaLevenshtein(msg, p);
      if (d < mejorDistancia && d <= maxTypos) {
        mejorDistancia = d;
        mejorBloque = bloque;
      }
    }
  }

  if (mejorBloque && mejorDistancia <= maxTypos) return mejorBloque.respuesta;
  return null;
}

/** Respuesta cuando no hay match */
export const RESPUESTA_DEFAULT = "¡Ay, eso no me lo han preguntao todavía, tigre! 😅 Dale, prueba con: \"¿Cuáles son las reglas?\", \"¿Cómo se juega?\" o \"¿Qué es el impostor?\" que de esa vaina sí tengo la data.";

/** Mensaje de bienvenida del canal */
export const MENSAJE_BIENVENIDA = "¡Qué lo qué! Soy el asistente de Lo' Menore' y Su Lío 🇩🇴 Escribe tu pregunta y te ayudo con la vaina del juego. Dale, no seas tímido.";

const RESPUESTAS = [
  {
    preguntas: [
      'cuales son las reglas',
      'cuales son las reglas del juego',
      'las reglas',
      'reglas',
      'dime las reglas',
      'que son las reglas',
      'explicame las reglas',
    ],
    respuesta: "Las reglas son: 1) Se reparten palabras dominicanas secretas; uno (o más) es el impostor y no tiene palabra. 2) Por turnos cada uno da una pista sin decir la palabra. 3) El impostor intenta no delatarse y puede adivinar la palabra o hacer que voten por otro. 4) Al final se vota o alguien acusa: si cazan al impostor ganan los normales; si el impostor adivina la palabra o los hacen votar por un inocente, gana el impostor. Mínimo 3 jugadores, máximo 10. ¡Eso e\' to\'!",
  },
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
      'klk manito',
      'que hay',
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
  // --- Más preguntas frecuentes ---
  {
    preguntas: [
      'que es una pista',
      'como doy una pista',
      'que es dar pistas',
      'puedo decir la palabra',
      'se puede decir la palabra secreta',
    ],
    respuesta: "Una pista es algo que describes de la palabra sin nombrarla. Ejemplo: si la palabra es mangú, dices \"algo que se come en el desayuno con los tres golpes\". No puedes decir la palabra; si la dices, te delatas. El impostor tiene que ir de vivo dando pistas que no lo pillen.",
  },
  {
    preguntas: [
      'cuanto dura una partida',
      'cuanto tiempo dura',
      'duracion del juego',
      'cuanto tarda una ronda',
    ],
    respuesta: "Depende de ustedes. Cada uno da su pista cuando le toca, luego votan o acusan. Una ronda puede ser 5 minutos o 15, según qué tan rápido hablen y decidan. No hay tiempo límite por turno.",
  },
  {
    preguntas: [
      'hay tiempo limite',
      'cuanto tiempo tengo para hablar',
      'tiempo por turno',
      'me pueden apurar',
    ],
    respuesta: "No hay cronómetro. Cada quien habla cuando le toca y toma el tiempo que necesite para dar su pista. Si quieren jugar rápido, lo hablan entre ustedes.",
  },
  {
    preguntas: [
      'cuantos impostores hay',
      'puede haber mas de un impostor',
      'dos impostores',
      'varios impostores',
    ],
    respuesta: "Sí. En la configuración puedes elegir cuántos impostores quieren: uno o más. Con más jugadores a veces ponen 2 impostores y se pone más difícil. El juego te deja elegir.",
  },
  {
    preguntas: [
      'es gratis',
      'hay que pagar',
      'cuesta dinero',
      'es de pago',
      'precio',
    ],
    respuesta: "El juego es gratis para jugar. Hay una versión premium por si quieren quitar anuncios o apoyar al creador, pero jugar jugar no te cuesta na\'.",
  },
  {
    preguntas: [
      'que es premium',
      'premium',
      'version premium',
      'vale la pena premium',
    ],
    respuesta: "Premium es para quitar anuncios y apoyar el juego. El juego completo se puede jugar sin pagar. Si te molesta la publicidad o quieres dar el apoyo, ahí está la opción.",
  },
  {
    preguntas: [
      'donde descargo',
      'donde lo descargo',
      'descargar el juego',
      'play store',
      'app store',
    ],
    respuesta: "En la Play Store (Android) búscalo como \"El Impostor Dominicano\" o \"Impostor Dominicano\". Si lo juegas en el navegador, no necesitas descargar nada. ¡Dale!",
  },
  {
    preguntas: [
      'funciona en iphone',
      'hay para iphone',
      'ios',
      'apple',
    ],
    respuesta: "Sí. Puedes jugarlo en el navegador desde el iPhone o, si hay versión en la App Store, búscalo como El Impostor Dominicano. El juego corre en el cel.",
  },
  {
    preguntas: [
      'es como among us',
      'parecido a among us',
      'among us dominicano',
      'diferencia con among us',
    ],
    respuesta: "La idea es parecida: hay impostor y hay que descubrirlo. Pero aquí no hay naves ni tareas; es con palabras dominicanas y pistas. Más pa\' hablar y reírse en persona. Tipo party game.",
  },
  {
    preguntas: [
      'como gano',
      'como ganar',
      'consejos para ganar',
      'trucos',
    ],
    respuesta: "Si eres normal: fíjate en las pistas de cada uno; el impostor a veces se resbala o dice algo que no cuadra. Si eres impostor: no te pases de listo, da pistas vagas y trata de que voten por otro. ¡A echar mente!",
  },
  {
    preguntas: [
      'como detectar al impostor',
      'como saber quien es el impostor',
      'señales del impostor',
    ],
    respuesta: "Fíjate en quien da pistas muy generales, quien tarda mucho en responder, quien no se atreve a acusar o quien dice cosas que no pegan con la categoría. El impostor no tiene la palabra, así que a veces se delata.",
  },
  {
    preguntas: [
      'puedo pasar mi turno',
      'me salto',
      'no quiero dar pista',
      'paso',
    ],
    respuesta: "Cada jugador tiene que dar su pista cuando le toca. No hay botón de \"pasar\"; si no quieres decir mucho, das una pista corta o algo vago, pero tienes que decir algo para seguir el orden.",
  },
  {
    preguntas: [
      'en que orden se habla',
      'orden de turnos',
      'quien sigue despues de mi',
      'como siguen los turnos',
    ],
    respuesta: "El juego elige al azar quién empieza. De ahí siguen en orden: el siguiente en la lista da su pista, y así hasta que todos pasen. Después votan o acusan.",
  },
  {
    preguntas: [
      'que pasa si empatan los votos',
      'empate en la votacion',
      'si hay empate',
    ],
    respuesta: "Si en la votación hay empate, normalmente no echan a nadie y puede que el impostor gane por tiempo o en la siguiente ronda. Depende cómo esté configurado; lo importante es que si no se ponen de acuerdo, el impostor tiene más chance.",
  },
  {
    preguntas: [
      'como veo mi palabra',
      'donde veo mi palabra',
      'voltear tarjeta',
      'que es voltear la tarjeta',
    ],
    respuesta: "Cuando te toque, mantén presionada la tarjeta (o el botón) un momento y se revela tu palabra. No la muestres a los demás. Si eres impostor, no tendrás palabra o te saldrá que eres el impostor.",
  },
  {
    preguntas: [
      'puedo quitar a un jugador',
      'eliminar jugador',
      'borrar jugador',
      'echar a un jugador',
    ],
    respuesta: "Sí. En la pantalla de jugadores hay opción para eliminar a alguien de la lista (el botón o ícono al lado del nombre). Úsalo si alguien se va o si se equivocaron al meter el nombre.",
  },
  {
    preguntas: [
      'como empiezo otra partida',
      'jugar de nuevo',
      'otra ronda',
      'reiniciar',
    ],
    respuesta: "Al terminar la partida puedes volver al inicio y armar otra: mismos jugadores o cambias la lista. No hay \"reinicio\" automático; vuelves a la pantalla principal y configuras de nuevo.",
  },
  {
    preguntas: [
      'quien hizo el juego',
      'quien lo creo',
      'autor',
      'creador',
      'desarrollador',
    ],
    respuesta: "El juego lo creó Brayan Camacho. Es el Impostor Dominicano, pa\' jugar con la familia y los panas con palabras bien nuestras. 🇩🇴",
  },
  {
    preguntas: [
      'por que dominicano',
      'de que pais es',
      'solo dominicano',
      'palabras dominicanas por que',
    ],
    respuesta: "Porque está hecho pa\' nosotros. Las palabras son de aquí: comida, música, barrios, youtubers, tradiciones... Para que nos identifiquemos y nos partamos de risa con lo que conocemos.",
  },
  {
    preguntas: [
      'esta en ingles',
      'hay en ingles',
      'idioma',
      'cambiar idioma',
    ],
    respuesta: "El juego está en español y tiene opción para inglés en ajustes. Las palabras son dominicanas, pero los menús y textos se pueden poner en inglés si lo necesitas.",
  },
  {
    preguntas: [
      'no me carga',
      'no funciona',
      'se traba',
      'se cierra la app',
    ],
    respuesta: "Prueba cerrar la app y abrirla de nuevo, o reiniciar el cel. Si lo juegas en el navegador, refresca la página. Si sigue fallando, puede ser el internet o el espacio del dispositivo. Si es en la app, actualízala desde la tienda.",
  },
  {
    preguntas: [
      'ayuda',
      'no entiendo',
      'no entiendo nada',
      'soporte',
      'tengo un problema',
    ],
    respuesta: "Dale, pregúntame lo que sea: reglas, cómo se juega, votar, acusar, impostor, categorías, modos diabólicos... Escribe tu duda y te explico. Si es un bug o algo técnico, el creador tiene soporte en la app o en la web.",
  },
  {
    preguntas: [
      'que modos hay',
      'lista de modos',
      'modos de juego',
      'modo facil',
      'modo dificil',
    ],
    respuesta: "Hay modos normales (eliges categorías, número de impostores, pista al impostor) y Modos Diabólicos: todos impostores menos uno, dos palabras, sin pistas, pistas mezcladas, palabra fantasma, espejo... En ajustes los activas y se pone la cosa heavy.",
  },
  {
    preguntas: [
      'como se elige la palabra',
      'quien elige la palabra',
      'palabras al azar',
    ],
    respuesta: "El juego elige las palabras al azar según las categorías que ustedes hayan puesto (comida, música, lugares, etc.). Nadie elige; a cada uno le toca una y el impostor no tiene o tiene una pista si lo activaron.",
  },
  {
    preguntas: [
      'puedo compartir con amigos',
      'compartir partida',
      'invitar amigos',
    ],
    respuesta: "No hay partida online compartida; se juega en persona con un solo cel. Pasas el cel para que cada uno vea su palabra y den pistas. Si quieres jugar con amigos, reúnelos y pasen el teléfono. ¡Así es más divertido!",
  },
  {
    preguntas: [
      'hay palabras ofensivas',
      'palabras malas',
      'contenido para adultos',
    ],
    respuesta: "Las palabras son dominicanas y de categorías normales: comida, música, lugares, tradiciones... Nada ofensivo. Es pa\' jugar con familia o amigos sin vainas incómodas.",
  },
  {
    preguntas: [
      'que pasa al final',
      'pantalla de resultados',
      'quien gano',
      'resultados',
    ],
    respuesta: "Al final sale quién ganó: los normales si cazaron al impostor, o el impostor si adivinó la palabra o los hizo votar por un inocente. Ahí se revela quién era el impostor y la palabra secreta. Pueden jugar otra ronda si quieren.",
  },
  {
    preguntas: [
      'que es revelar al impostor',
      'revelar impostor',
      'cuando se revela',
    ],
    respuesta: "Cuando todos ya vieron su palabra y pasaron por \"quién empieza\", hay una pantalla donde se muestra quién es el impostor (solo para que lo sepan al final, no antes). Durante el juego no se revela; al terminar la ronda sí.",
  },
  {
    preguntas: [
      'puedo sugerir palabras',
      'agregar palabras',
      'nuevas palabras',
      'mas palabras',
    ],
    respuesta: "Las palabras las trae el juego por categorías. Si quieres sugerir más, el creador a veces las agrega en actualizaciones. Puedes buscarlo en redes o en la app si hay forma de contactar y proponer.",
  },
  {
    preguntas: [
      'que es esto',
      'para que sirve',
      'que hace esta app',
      'que es esta app',
    ],
    respuesta: "Es un juego de fiesta: uno (o más) es el impostor sin saber la palabra secreta; el resto tiene palabras dominicanas y dan pistas. Hay que descubrir al impostor votando o acusando. Se juega en persona con un solo cel. ¡Pruébalo!",
  },
  {
    preguntas: [
      'adios',
      'bye',
      'nos vemos',
      'chao',
      'hasta luego',
    ],
    respuesta: "¡Dale, nos vemos! Que te vaya bien en la partida. 🇩🇴",
  },
  {
    preguntas: [
      'vacan',
      'ta vacan',
      'esta bueno',
      'me gusta',
      'increible',
    ],
    respuesta: "¡Qué bueno que te guste! Pásale la voz a los panas y échense unas partidas. 🇩🇴",
  },
  {
    preguntas: [
      'que categoria elijo',
      'cual categoria',
      'mejor categoria',
      'recomendacion categorias',
    ],
    respuesta: "Depende del grupo. Comida y música casi todo el mundo los conoce. Si son jóvenes, youtubers y barrios pueden caer bien. Mezcla dos o tres y se pone variado. ¡Prueba!",
  },
  {
    preguntas: [
      'anuncios',
      'hay anuncios',
      'publicidad',
      'quitar anuncios',
    ],
    respuesta: "Sí puede haber anuncios en la versión gratis. Si te molestan, está la opción premium para quitarlos. El juego se puede jugar igual con o sin anuncios.",
  },
  {
    preguntas: [
      'actualizaciones',
      'hay actualizaciones',
      'nuevas versiones',
      'cuando actualizan',
    ],
    respuesta: "El creador va sacando actualizaciones con más palabras, modos o arreglos. Actualiza la app desde la Play Store (o App Store) cuando salga una nueva versión para tener todo al día.",
  },
  {
    preguntas: [
      'contacto',
      'donde contactar',
      'escribir al creador',
      'soporte tecnico',
    ],
    respuesta: "En la app o en la web del juego suele haber opción de soporte o contacto. Si no, búscalo en redes como El Impostor Dominicano o el nombre del creador (Brayan Camacho) y ahí puedes escribir.",
  },
];
