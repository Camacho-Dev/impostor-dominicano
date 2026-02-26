// Base de datos de palabras dominicanas con pistas descriptivas

/**
 * Obtiene una palabra aleatoria de una categoría, o de todas si no se especifica.
 */
export function obtenerPalabraAleatoria(categorias) {
  const todas = palabrasDominicanas;
  let lista = [];
  if (!categorias || (Array.isArray(categorias) && categorias.length === 0)) {
    lista = Object.values(todas).flat();
  } else {
    const cats = Array.isArray(categorias) ? categorias : [categorias];
    cats.forEach(c => {
      if (todas[c]) lista = lista.concat(todas[c]);
    });
  }
  if (lista.length === 0) lista = Object.values(todas).flat();
  const entrada = lista[Math.floor(Math.random() * lista.length)];
  return typeof entrada === 'string' ? entrada : entrada.palabra;
}

/**
 * Devuelve una pista aleatoria de una palabra específica.
 * Si la palabra tiene pistas definidas, retorna una de ellas.
 * Si no, retorna una descripción genérica.
 */
export function obtenerPistaDepalabra(palabra) {
  const todas = Object.values(palabrasDominicanas).flat();
  const entrada = todas.find(p => (typeof p === 'string' ? p : p.palabra) === palabra);
  if (entrada && typeof entrada === 'object' && entrada.pistas && entrada.pistas.length > 0) {
    return entrada.pistas[Math.floor(Math.random() * entrada.pistas.length)];
  }
  return `Piensa en algo relacionado con "${palabra}"`;
}

/**
 * Genera una pista para el impostor basada en la palabra real.
 * El impostor recibe una pista de la misma palabra secreta para poder defenderse,
 * pero sin saber exactamente cuál es la palabra.
 */
export function generarPistaImpostor(palabraReal) {
  return obtenerPistaDepalabra(palabraReal);
}

/**
 * Genera múltiples pistas falsas para varios impostores.
 */
export function generarPistasImpostores(palabraReal, cantidad) {
  const pistas = [];
  for (let i = 0; i < cantidad; i++) {
    pistas.push(generarPistaImpostor(palabraReal));
  }
  return pistas;
}

export const palabrasDominicanas = {

  comida: [
    { palabra: "Mangú", pistas: ["Se hace aplastando plátano verde hervido", "El desayuno más famoso del país", "Se acompaña con los Tres Golpes"] },
    { palabra: "La Bandera", pistas: ["El almuerzo típico dominicano de cada día", "Lleva arroz, habichuelas y carne", "Se sirve al mediodía en casi toda casa dominicana"] },
    { palabra: "Sancocho", pistas: ["Un guisado espeso con varias carnes y viandas", "Se cocina en ocasiones especiales", "El de 7 carnes es el más famoso"] },
    { palabra: "Tostones", pistas: ["Plátano verde frito, aplastado y vuelto a freír", "Van bien con ajo y sal", "Acompañan casi cualquier comida"] },
    { palabra: "Yaroa", pistas: ["Papas fritas con carne picada y queso derretido", "Street food popular en Santiago", "Puede llevar pollo o res encima"] },
    { palabra: "Pica pollo", pistas: ["Pollo frito crujiente al estilo dominicano", "Se come de noche en el colmado", "Con tostones y kétchup es lo más"] },
    { palabra: "Locrio", pistas: ["Arroz cocido con carne y condimentos", "Similar al arroz frito pero dominicano", "Puede ser de pollo, salami o mariscos"] },
    { palabra: "Asopao", pistas: ["Arroz caldoso con pollo o mariscos", "Es como una sopa espesa con arroz", "Se come cuando hace frío o estás enfermo"] },
    { palabra: "Pastelón", pistas: ["Lasaña dominicana hecha con plátano maduro", "Lleva carne molida entre capas de plátano", "Dulce y salado a la vez"] },
    { palabra: "Chivo guisado", pistas: ["Carne de chivo cocinada lentamente con especias", "Plato típico del Cibao y el sur", "Muy popular en las fiestas de campo"] },
    { palabra: "Chicharrón de cerdo", pistas: ["Piel y carne de cerdo frita hasta quedar crujiente", "Se vende en los colmados", "Con limón y tostones es un clásico"] },
    { palabra: "Longaniza", pistas: ["Chorizo dominicano hecho con cerdo y especias", "Se fríe en el desayuno", "Acompaña el mangú o el arroz"] },
    { palabra: "Salami", pistas: ["Embutido rojo que no puede faltar en el desayuno", "Se fríe en la sartén hasta que dore", "Va con el mangú en Los Tres Golpes"] },
    { palabra: "Mofongo", pistas: ["Plátano verde frito y machacado con chicharrón", "De origen africano, adoptado como propio", "Se sirve en un pilón"] },
    { palabra: "Mondongo", pistas: ["Sopa hecha con tripas y vísceras de res", "Plato típico del desayuno del domingo", "Se come con limón y orégano"] },
    { palabra: "Los Tres Golpes", pistas: ["El desayuno más completo del dominicano", "Lleva mangú, salami, queso y huevos", "Sin esto, el día no empieza bien"] },
    { palabra: "Habichuelas con dulce", pistas: ["Postre de Semana Santa hecho con habichuelas rojas", "Lleva leche, coco y especias dulces", "Se come fría o caliente en Cuaresma"] },
    { palabra: "Jalao", pistas: ["Dulce hecho con coco rallado y melao de caña", "De color dorado y muy pegajoso", "Dulce típico de las fiestas navideñas"] },
    { palabra: "Morir soñando", pistas: ["Bebida de jugo de naranja con leche", "El nombre dice cómo te sientes al tomarlo", "Dulce y refrescante, muy dominicana"] },
    { palabra: "Mamajuana", pistas: ["Bebida con ron, vino y miel macerada con palos y hierbas", "Se dice que tiene propiedades medicinales", "El viagra dominicano, según la gente"] },
    { palabra: "Cerveza Presidente", pistas: ["La cerveza nacional más tomada en RD", "Viene en botella verde bien fría", "En toda fiesta dominicana hay una"] },
    { palabra: "Chinola", pistas: ["Fruta amarilla de cáscara dura con jugo ácido", "Con su jugo se hace una bebida muy popular", "La fruta de la pasión dominicana"] },
    { palabra: "Lechosa", pistas: ["Fruta de pulpa naranja y semillas negras", "Se llama papaya en otros países", "Con azúcar y leche es un postre sencillo"] },
    { palabra: "Casabe", pistas: ["Pan fino y crujiente hecho de yuca", "Comida de los taínos que llegó hasta hoy", "Se usa como galleta o acompañante"] },
    { palabra: "Plátano maduro frito", pistas: ["Rodajas de plátano dulce fritas en aceite", "Dulce y suave, acompañante del almuerzo", "Los llaman 'maduros' en el plato"] },
    { palabra: "Yuca", pistas: ["Tubérculo blanco que se hierve o se fríe", "Base de la alimentación desde los taínos", "Con mojo de ajo es deliciosa"] },
    { palabra: "Batata", pistas: ["Tubérculo dulce de piel morada o rosada", "Se puede hervir, hornear o freír", "Dulce natural, sin azúcar añadida"] },
    { palabra: "Café negro", pistas: ["La bebida caliente favorita del dominicano", "Se toma sin leche y bien cargado", "Sin esto, muchos no pueden comenzar el día"] },
  ],

  historia: [
    { palabra: "Juan Pablo Duarte", pistas: ["Padre de la Patria dominicana", "Fundó La Trinitaria en secreto", "Luchó por la independencia sin buscar poder personal"] },
    { palabra: "Francisco del Rosario Sánchez", pistas: ["Uno de los tres Padres de la Patria", "Leyó el acta de independencia en la Puerta del Conde", "Nunca abandonó la causa aunque lo persiguieron"] },
    { palabra: "Matías Ramón Mella", pistas: ["El que disparó el trabucazo que inició la independencia", "Padre de la Patria que era militar", "Su grito fue la señal para comenzar la noche del 27 de febrero"] },
    { palabra: "Las Hermanas Mirabal", pistas: ["Cuatro hermanas que se opusieron a la dictadura de Trujillo", "Las llamaban Las Mariposas", "Fueron asesinadas el 25 de noviembre de 1960"] },
    { palabra: "Gregorio Luperón", pistas: ["Héroe de la Restauración dominicana", "Luchó contra la anexión a España", "Fue presidente provisional y gran patriota"] },
    { palabra: "27 de Febrero", pistas: ["La noche que dominicanos proclamaron su independencia", "Año 1844, en la Puerta del Conde", "Fiesta nacional más importante del país"] },
    { palabra: "La Independencia", pistas: ["Separación de Haití en 1844", "Lograda por La Trinitaria y otros patriotas", "Se celebra cada 27 de febrero con desfiles"] },
    { palabra: "La Restauración", pistas: ["Guerra para recuperar la soberanía después de la anexión a España", "Se celebra el 16 de agosto", "Luperón fue uno de sus grandes héroes"] },
    { palabra: "La Trinitaria", pistas: ["Sociedad secreta fundada por Duarte", "Solo tres miembros al principio, en referencia a la Santísima Trinidad", "La organización que planeó la independencia dominicana"] },
    { palabra: "Zona Colonial", pistas: ["El casco histórico de Santo Domingo", "Primera ciudad europea fundada en América", "Declarada Patrimonio de la Humanidad por la UNESCO"] },
    { palabra: "Rafael Leónidas Trujillo", pistas: ["Dictador que gobernó por 31 años", "Lo llamaban El Jefe o El Generalísimo", "Su régimen fue uno de los más brutales de América Latina"] },
    { palabra: "Enriquillo", pistas: ["Cacique taíno que resistió la conquista española", "Vivió refugiado en la Sierra de Bahoruco", "Logró un tratado de paz con la Corona española"] },
    { palabra: "Anacaona", pistas: ["Reina taína poeta y artista", "Fue ejecutada por los españoles", "Su nombre significa 'flor de oro' en taíno"] },
    { palabra: "Ocupación Norteamericana", pistas: ["Estados Unidos ocupó el país entre 1916 y 1924", "Trajo cambios en infraestructura pero quitó la soberanía", "Muchos dominicanos se resistieron a ella"] },
    { palabra: "Puerta del Conde", pistas: ["Lugar donde se izó la bandera dominicana por primera vez", "Está en el Parque Independencia en Santo Domingo", "Sitio histórico de la proclamación de la independencia"] },
    { palabra: "Joaquín Balaguer", pistas: ["Presidente que gobernó varios períodos", "Lo llamaban El Caudillo", "Construyó el Faro a Colón"] },
    { palabra: "Juan Bosch", pistas: ["Primer presidente electo democráticamente tras la era Trujillo", "También fue gran escritor y cuentista", "Fundó el PLD antes de salir del PRD"] },
    { palabra: "Revolución de Abril", pistas: ["Levantamiento popular de 1965 para restaurar la constitución", "Fue interrumpida por una intervención norteamericana", "Los 'constitucionalistas' querían que volviera Juan Bosch"] },
    { palabra: "Catedral Primada de América", pistas: ["Primera catedral construida en el Nuevo Mundo", "Está en la Zona Colonial de Santo Domingo", "Fue terminada en el siglo XVI"] },
    { palabra: "Fortaleza Ozama", pistas: ["La fortaleza militar más antigua de América", "Está a orillas del río Ozama en Santo Domingo", "Fue usada como cárcel durante siglos"] },
  ],

  lugares: [
    { palabra: "Santo Domingo", pistas: ["La capital de la República Dominicana", "Primera ciudad europea fundada en América", "A orillas del río Ozama"] },
    { palabra: "Santiago de los Caballeros", pistas: ["La segunda ciudad más grande del país", "Corazón del Cibao", "Ciudad del tabaco y el merengue típico"] },
    { palabra: "Punta Cana", pistas: ["Famoso destino turístico al este del país", "Sus playas tienen arena blanca y agua azul turquesa", "Llegan millones de turistas cada año"] },
    { palabra: "Jarabacoa", pistas: ["Municipio de montaña con clima frío y ríos", "Conocida por sus cascadas y rafting", "La 'Ciudad de la Eterna Primavera'"] },
    { palabra: "Constanza", pistas: ["Valle de montaña donde se produce gran parte de las verduras del país", "Hace frío como pocos lugares de RD", "Tiene influencia de inmigrantes japoneses y europeos"] },
    { palabra: "Bahía de las Águilas", pistas: ["Una de las playas más vírgenes y hermosas del Caribe", "Está en Pedernales, muy al sur del país", "Para llegar hay que ir en bote o caminar"] },
    { palabra: "Pico Duarte", pistas: ["El pico más alto de todo el Caribe", "Lleva el nombre del Padre de la Patria", "Está en la Cordillera Central"] },
    { palabra: "Lago Enriquillo", pistas: ["El lago más grande del Caribe", "Está por debajo del nivel del mar", "Tiene cocodrilos americanos e iguanas"] },
    { palabra: "Samaná", pistas: ["Península famosa por las ballenas jorobadas en invierno", "Tiene playas de palmeras caídas muy fotogénicas", "Las Terrenas y Las Galeras están aquí"] },
    { palabra: "Cabarete", pistas: ["Pueblo costero del norte famoso por el kitesurf y el windsurf", "Tiene una vibrante vida nocturna", "Muy popular entre extranjeros y turistas jóvenes"] },
    { palabra: "Isla Saona", pistas: ["Isla famosa por su piscina natural de mar poco profundo", "Está cerca de La Romana", "Aparece en muchas fotos de revistas de viajes"] },
    { palabra: "Los Tres Ojos", pistas: ["Sistema de cuevas con lagunas de diferentes colores", "Está en Santo Domingo Este", "Formación natural de piedra caliza con agua subterránea"] },
    { palabra: "Altos de Chavón", pistas: ["Pueblo medieval construido en los años 70 junto al río Chavón", "Está en La Romana y parece de la Edad Media", "Tiene un anfiteatro donde han cantado artistas famosos"] },
    { palabra: "El Malecón", pistas: ["Avenida a orillas del mar en Santo Domingo", "Es el punto de reunión en carnaval y fiestas", "Corre paralela al mar por varios kilómetros"] },
    { palabra: "Valle del Cibao", pistas: ["La región agrícola más fértil del país", "Está entre la Cordillera Central y la Septentrional", "Santiago está en el corazón de este valle"] },
    { palabra: "Barahona", pistas: ["Provincia del sur conocida por su larimar y sus playas", "Tiene paisajes áridos con vista al mar Caribe", "Playa Quemaíto y San Rafael son famosas aquí"] },
    { palabra: "Boca Chica", pistas: ["Playa de aguas tranquilas y poco profundas cerca de la capital", "Muy concurrida los fines de semana por capitalinos", "Tiene un arrecife de coral que protege sus aguas"] },
    { palabra: "Cascada El Limón", pistas: ["Catarata de unos 50 metros en la Península de Samaná", "Se llega a caballo por un sendero en la montaña", "Una de las cascadas más bellas del país"] },
    { palabra: "Dajabón", pistas: ["Ciudad fronteriza con Haití al noroeste del país", "Tiene un mercado binacional muy activo los lunes y viernes", "El río Masacre separa esta ciudad de Haití"] },
    { palabra: "Pedernales", pistas: ["La provincia más al suroeste y remota del país", "Aquí está la Bahía de las Águilas", "Fronteriza con Haití en la punta sur"] },
  ],

  personajes: [
    { palabra: "Pedro Martínez", pistas: ["Lanzador dominicano con tres Cy Young en las Grandes Ligas", "Jugó para los Red Sox y los Mets entre otros", "Considerado uno de los mejores pitchers de la historia"] },
    { palabra: "David Ortiz", pistas: ["El 'Big Papi', bateador designado de los Red Sox", "Ganó tres Series Mundiales con Boston", "Amado tanto en RD como en Estados Unidos"] },
    { palabra: "Juan Luis Guerra", pistas: ["El músico dominicano más reconocido internacionalmente", "Mezcló merengue, bachata y pop con letras poéticas y sociales", "Ganó múltiples Grammy con canciones como 'Ojalá que llueva café'"] },
    { palabra: "Romeo Santos", pistas: ["El Rey de la Bachata moderna", "Comenzó en el grupo Aventura con sus primos", "Sus conciertos llenan el Madison Square Garden"] },
    { palabra: "Fernando Tatis Jr.", pistas: ["Shortstop de los Padres de San Diego, hijo de Fernando Tatis", "Uno de los jugadores más emocionantes del béisbol actual", "Se lesionó el hombro en su mejor temporada"] },
    { palabra: "Sammy Sosa", pistas: ["Jardinero que llegó a 66 jonrones en 1998", "Su rivalidad con Mark McGwire revivió el béisbol", "Fue jugador de los Cubs de Chicago"] },
    { palabra: "Félix Sánchez", pistas: ["Corredor dominicano medallista de oro olímpico en 400 metros con vallas", "Ganó en Atenas 2004 y Londres 2012", "Lloró en el podio y emocionó al país entero"] },
    { palabra: "Bartolo Colón", pistas: ["Lanzador dominicano que jugó más de 20 temporadas en Grandes Ligas", "Famoso por su cuerpo robusto y su efectividad con poco esfuerzo aparente", "Ganó el Cy Young con los Medias Blancas de Chicago"] },
    { palabra: "Johnny Ventura", pistas: ["El Caballo Mayor del merengue dominicano", "Modernizó el merengue en los años 60 y 70", "Fue también político y regidor de Santo Domingo"] },
    { palabra: "Zoe Saldaña", pistas: ["Actriz dominicana conocida por Avatar y Guardianes de la Galaxia", "Nació en Nueva York pero creció en Santo Domingo", "Una de las actrices más taquilleras de Hollywood"] },
    { palabra: "Michelle Rodríguez", pistas: ["Actriz conocida por la saga Fast & Furious y Avatar", "Sus padres son dominicanos y puertorriqueños", "Suele hacer papeles de mujer fuerte y guerrera"] },
    { palabra: "Juan Bosch", pistas: ["Escritor y político que ganó las primeras elecciones libres tras Trujillo", "Sus cuentos son parte de la literatura latinoamericana", "Fundó el PLD después de salir del PRD"] },
    { palabra: "Fefita la Grande", pistas: ["La reina del merengue típico y el acordeón", "Ha tocado desde niña y sigue activa décadas después", "Su voz y su acordeón son únicos en la música dominicana"] },
    { palabra: "El Alfa", pistas: ["El rey del dembow dominicano", "Sus canciones mezclan rap, trap y ritmos urbanos locales", "Tiene millones de seguidores en todo el Caribe y Latinoamérica"] },
    { palabra: "Tokischa", pistas: ["Cantante urbana dominicana conocida por su imagen provocadora", "Ha colaborado con J Balvin y otros artistas internacionales", "Nacida en Los Mina, Santo Domingo"] },
    { palabra: "Oscar de la Renta", pistas: ["Diseñador de moda dominicano de fama mundial", "Vistió a primeras damas y celebridades internacionales", "Nació en Santo Domingo y triunfó en París y Nueva York"] },
    { palabra: "Karl-Anthony Towns", pistas: ["Jugador dominicano de la NBA, centro de los Timberwolves", "Su madre murió de COVID-19 y él lo hizo público para concienciar", "Uno de los mejores centros tiradores en la historia de la NBA"] },
    { palabra: "Salomé Ureña", pistas: ["Poetisa y educadora dominicana del siglo XIX", "Fundó el primer instituto de señoritas en el país", "Es madre de Pedro Henríquez Ureña"] },
  ],

  artistas: [
    { palabra: "Johnny Ventura", pistas: ["Modernizó el merengue con coreografías y vestuario llamativo", "Lo apodan El Caballo Mayor", "Fue símbolo del merengue por décadas"] },
    { palabra: "Wilfrido Vargas", pistas: ["Músico que fusionó merengue con influencias internacionales", "Hizo famosa la frase 'El Barbarazo'", "Descubrió a muchos artistas dominicanos"] },
    { palabra: "Fernando Villalona", pistas: ["El Mayimbe del merengue dominicano", "Voz potente y estilo elegante en el escenario", "Sus éxitos suenan en toda fiesta dominicana de los 80 y 90"] },
    { palabra: "Romeo Santos", pistas: ["Transformó la bachata en un género global", "Su álbum 'Fórmula' vendió millones", "Hijo del Bronx con raíces dominicanas"] },
    { palabra: "Juan Luis Guerra", pistas: ["Sus letras hablan de amor, pobreza y fe con metáforas brillantes", "Estudió música en Berklee College of Music", "Es el artista dominicano más premiado de la historia"] },
    { palabra: "El Alfa", pistas: ["Pionero del dembow en República Dominicana", "Sus videoclips tienen producción de alta calidad", "Fans lo llaman 'El Jefe del Dembow'"] },
    { palabra: "Cándido Bidó", pistas: ["Pintor dominicano conocido por sus figuras de ojos grandes y colores vibrantes", "Sus obras representan la vida cotidiana dominicana", "Uno de los pintores más reconocibles del Caribe"] },
    { palabra: "Pedro Mir", pistas: ["El poeta nacional de la República Dominicana", "Escribió 'Hay un país en el mundo'", "Exiliado durante la dictadura de Trujillo"] },
    { palabra: "Salomé Ureña", pistas: ["Primera poetisa dominicana reconocida nacionalmente", "Aparece en el billete de cien pesos", "Fundadora de la primera escuela normal de mujeres"] },
    { palabra: "Fefita la Grande", pistas: ["Acordeonista virtuosa que empezó a tocar siendo niña", "Mezcla merengue típico con humor y carisma", "Es una institución de la música dominicana"] },
    { palabra: "Los Hermanos Rosario", pistas: ["Orquesta familiar que renovó el merengue de orquesta", "Sus éxitos llenan toda pista de baile", "Son varios hermanos que tocan juntos desde jóvenes"] },
    { palabra: "Anthony Santos", pistas: ["El Mayimbe de la bachata", "Sus canciones hablan de desamor con mucho sentimiento", "Pionero de la bachata moderna junto a otros"] },
    { palabra: "Natti Natasha", pistas: ["Cantante de reguetón y música urbana dominicana", "Ha colaborado con Daddy Yankee, Ozuna y muchos más", "Primera mujer latina en ganar ciertos premios urbanos"] },
    { palabra: "Oscar de la Renta", pistas: ["Diseñó vestidos para primeras damas y reinas de belleza", "Nació en Santo Domingo y conquistó el mundo de la moda", "Su firma sigue siendo referencia en alta costura"] },
    { palabra: "Aventura", pistas: ["Grupo de bachata del Bronx con raíces dominicanas", "Popularizaron la bachata fuera del país con 'Obsesión'", "Romeo Santos era su vocalista principal"] },
  ],

  musica: [
    { palabra: "Merengue", pistas: ["El ritmo nacional de República Dominicana", "Se baila en pareja con pasos rápidos de cadera", "Usa tambora, güira y acordeón o saxofón"] },
    { palabra: "Bachata", pistas: ["Ritmo dominicano de guitarra con letras de amor y desamor", "Nació en los barrios marginales y hoy es mundial", "Se declaró Patrimonio de la Humanidad por la UNESCO"] },
    { palabra: "Dembow", pistas: ["Ritmo urbano dominicano parecido al reguetón pero más acelerado", "El Alfa es su máximo exponente actual", "Dominó las fiestas caribeñas en los años 2010"] },
    { palabra: "Perico Ripiao", pistas: ["El estilo más tradicional del merengue", "También llamado merengue típico o del Cibao", "Usa acordeón, tambora y güira sin saxofones"] },
    { palabra: "Tambora", pistas: ["Tambor de dos parches que marca el ritmo en el merengue", "Se toca con un palo y con la mano", "Sin ella no hay merengue de verdad"] },
    { palabra: "Güira", pistas: ["Instrumento de metal raspado que da el ritmo en el merengue", "Parece un rallador de cocina gigante", "Se toca raspando con un peinillo de metal"] },
    { palabra: "Ojalá que llueva café", pistas: ["Canción de Juan Luis Guerra sobre el deseo de un campesino", "Es quizás la canción dominicana más conocida en el mundo", "Habla de que llueva café, yuca y batata en el campo"] },
    { palabra: "Obsesión", pistas: ["Canción de Aventura que se hizo viral antes de las redes sociales", "Mezcla bachata con hip-hop y tiene letra apasionada", "La frase 'No es un amor, es una obsesión' la conoce todo el mundo"] },
    { palabra: "Salve", pistas: ["Canto religioso afrodominicano para los santos", "Se usa en velorios, fiestas patronales y rituales", "Es parte del Patrimonio Inmaterial dominicano"] },
    { palabra: "Palos", pistas: ["Tambores de origen africano usados en rituales y festividades", "Son sagrados en muchas comunidades dominicanas", "Su música acompaña los velorios de santos"] },
    { palabra: "Gagá", pistas: ["Procesión musical de origen haitiano que sale en Semana Santa", "Usa instrumentos de viento hechos de lata y palos", "Es colorida, ruidosa y llena de energía ritual"] },
    { palabra: "La Bilirrubina", pistas: ["Canción de Juan Luis Guerra que compara el amor con una enfermedad", "Su título es el nombre de un componente de la sangre", "Una de las canciones de merengue más famosas de los 90"] },
    { palabra: "Acordeón", pistas: ["Instrumento de fuelle que es el corazón del merengue típico", "Llegó a RD con inmigrantes europeos en el siglo XIX", "Tatico Henríquez y El Prodigio son maestros de este instrumento"] },
    { palabra: "Visa para un sueño", pistas: ["Canción de Juan Luis Guerra sobre los dominicanos que emigran", "Habla del sufrimiento de pedir visa y ser rechazado", "Es un himno para la diáspora dominicana"] },
  ],

  deportes: [
    { palabra: "Béisbol", pistas: ["El deporte nacional de República Dominicana", "Millones de niños sueñan con jugar en las Grandes Ligas", "El país ha producido más peloteros por habitante que ningún otro"] },
    { palabra: "LIDOM", pistas: ["La liga de béisbol profesional dominicana", "Juega en temporada de invierno", "Sus equipos representan diferentes regiones del país"] },
    { palabra: "Águilas Cibaeñas", pistas: ["El equipo de béisbol más popular de Santiago y el Cibao", "Tienen más títulos de LIDOM que ningún otro equipo", "Sus colores son azul y rojo"] },
    { palabra: "Tigres del Licey", pistas: ["El equipo de béisbol más antiguo y popular de Santo Domingo", "Rival eterno de las Águilas Cibaeñas", "Sus colores son azul y blanco"] },
    { palabra: "Pedro Martínez", pistas: ["Ganó tres premios Cy Young como mejor lanzador", "Fue casi invencible en sus años con los Red Sox", "Es ídolo en Manoguayabo, su pueblo natal"] },
    { palabra: "David Ortiz", pistas: ["Fue el gran bateador designado de los Boston Red Sox", "Rompió la 'Maldición del Bambino' en 2004", "Su número 34 fue retirado por los Red Sox"] },
    { palabra: "Félix Sánchez", pistas: ["Medallista de oro olímpico en 400 metros con vallas", "Ganó en Atenas 2004 y en Londres 2012, con 8 años de diferencia", "Su llanto en el podio lo hizo icónico"] },
    { palabra: "Estadio Quisqueya", pistas: ["El estadio de béisbol más famoso de Santo Domingo", "Sede de los partidos de LIDOM en la capital", "Tiene el nombre del antiguo nombre taíno de la isla"] },
    { palabra: "Jonrón", pistas: ["Cuando el bateador manda la pelota fuera del parque", "Vale una carrera por cada corredor en base", "El momento más emocionante del béisbol"] },
    { palabra: "Serie del Caribe", pistas: ["Torneo donde compiten los campeones de las ligas de béisbol de varios países caribeños", "RD siempre lleva uno de sus equipos de LIDOM", "Se juega en febrero después de las ligas invernales"] },
    { palabra: "Juan Soto", pistas: ["Jardinero dominicano que firmó el contrato más grande en la historia del béisbol", "Debutó en Grandes Ligas a los 19 años con los Nacionales de Washington", "Conocido por su ojo de bateo excepcional"] },
    { palabra: "Fernando Tatis Jr.", pistas: ["Su padre también fue pelotero de Grandes Ligas", "Shortstop de los Padres con enorme carisma", "Fue suspendido por dopaje pero regresó con fuerza"] },
    { palabra: "Clásico Mundial", pistas: ["Torneo internacional de béisbol donde RD ha ganado dos veces", "Compiten selecciones nacionales de todo el mundo", "La victoria de RD en 2013 fue histórica"] },
    { palabra: "Al Horford", pistas: ["Jugador dominicano de la NBA, ala-pívot de los Celtics", "Fue la primera selección del draft para los Hawks en 2007", "Su padre Tito Horford también jugó en la NBA"] },
  ],

  festividades: [
    { palabra: "Carnaval", pistas: ["Fiesta de disfraces y música que se celebra en febrero", "El de La Vega es el más famoso del país", "Los personajes usan máscaras y vejigas para golpear a la gente"] },
    { palabra: "Diablo Cojuelo", pistas: ["Personaje del carnaval dominicano con traje de espejo y máscara de cuernos", "Usa una vejiga de res para 'golpear' a los espectadores", "El más icónico del carnaval de La Vega"] },
    { palabra: "Semana Santa", pistas: ["La semana más religiosa y también más de playa en RD", "Los dominicanos van a la costa masivamente", "Se come habichuelas con dulce y bacalao"] },
    { palabra: "27 de Febrero", pistas: ["Día de la Independencia dominicana", "Se celebra con desfiles militares y civiles", "En 1844 fue cuando se proclamó la independencia de Haití"] },
    { palabra: "16 de Agosto", pistas: ["Día de la Restauración, cuando se recuperó la soberanía", "Se celebra con desfiles y actos culturales", "Conmemora el inicio de la Guerra Restauradora en 1863"] },
    { palabra: "Habichuelas con dulce", pistas: ["El postre más esperado de Semana Santa", "Mezcla habichuelas rojas con leche, coco, batata y especias", "Se come fría o caliente y hay debates sobre cuál es mejor"] },
    { palabra: "Navidad dominicana", pistas: ["Las fiestas más largas del año, desde el 23 de diciembre", "Con parrandas, pernil, pasteles y mucho ron", "La familia se reúne y la música no para"] },
    { palabra: "Parrandas navideñas", pistas: ["Grupos de personas que visitan casas cantando aguinaldos en Navidad", "Tocan instrumentos y piden comida y bebida como regalo", "Tradición que viene de la música española y africana mezclada"] },
    { palabra: "Carnaval de La Vega", pistas: ["El carnaval más antiguo y famoso de República Dominicana", "Sus diablos cojuelos son los más elaborados y coloridos", "Se celebra todos los domingos de febrero"] },
    { palabra: "Fiestas patronales", pistas: ["Celebraciones en honor al santo patrón de cada pueblo", "Incluyen misas, bailes, comida típica y juegos", "Cada barrio o municipio tiene las suyas en fechas distintas"] },
    { palabra: "La Altagracia", pistas: ["La virgen patrona de la República Dominicana", "Su fiesta es el 21 de enero", "Millones peregrinan a Higüey cada año para visitarla"] },
    { palabra: "Día de la Altagracia", pistas: ["Fiesta religiosa más importante del calendario dominicano", "Los fieles hacen promesas y peregrinaciones a Higüey", "Celebración del 21 de enero en honor a la patrona del país"] },
    { palabra: "Los Reyes Magos", pistas: ["El 6 de enero los niños reciben regalos de los Reyes", "Muchas familias dominicanas los celebran además de la Navidad", "Baltasar, Melchor y Gaspar son sus nombres"] },
    { palabra: "Gagá de Semana Santa", pistas: ["Procesión musical que recorre los bateyes en Viernes Santo", "Mezcla ritos afrodominicanos con tradición haitiana", "Sus participantes usan disfraces coloridos y trompetas de lata"] },
  ],

  tradiciones: [
    { palabra: "El colmado", pistas: ["La tienda de barrio dominicana que vende de todo", "También es punto de reunión social con música y bebida", "Sin el colmado, la vida de barrio no sería igual"] },
    { palabra: "El motoconcho", pistas: ["Transporte público en motocicleta, muy popular en pueblos", "Es rápido pero poco seguro", "El medio de transporte más económico del interior del país"] },
    { palabra: "Jugar dominó", pistas: ["El juego de mesa más popular en los colmados dominicanos", "Se juega en equipos de dos con fichas rectangulares", "Muchos debates y risas nacen alrededor de una mesa de dominó"] },
    { palabra: "El Ciguapa", pistas: ["Criatura mitológica dominicana con los pies al revés", "Según la leyenda, aparece de noche en el campo", "Es mujer, hermosa y te puede hacer perder el camino"] },
    { palabra: "El Bacá", pistas: ["Ser del folclore dominicano que da poder y riqueza a cambio de algo", "Se dice que algunos empresarios hacen un pacto con él", "Relacionado con la brujería y el mundo espiritual"] },
    { palabra: "Larimar", pistas: ["Piedra semipreciosa azul que solo se encuentra en RD y el Caribe", "Sus tonos van del blanco al azul profundo", "Es símbolo de la artesanía dominicana"] },
    { palabra: "Ámbar dominicano", pistas: ["Resina fosilizada de árbol de millones de años", "La mina más importante está en La Cordillera Septentrional", "A veces contiene insectos o plantas perfectamente conservados"] },
    { palabra: "Volar chiringas", pistas: ["Tradición dominicana de volar cometas durante Semana Santa", "Los niños hacen sus propias chiringas con papel y madera", "El cielo se llena de colores cada año en esas fechas"] },
    { palabra: "El velorio", pistas: ["Reunión familiar y comunitaria para despedir a un difunto", "Se reza, se canta y también se come y bebe juntos", "Puede durar toda la noche hasta el entierro"] },
    { palabra: "La quinceañera", pistas: ["Celebración del decimoquinto cumpleaños de una muchacha", "Incluye misa, vals, vestido elegante y fiesta grande", "Es un rito de paso de niña a mujer en la cultura dominicana"] },
    { palabra: "Tá to bien", pistas: ["Expresión dominicana que significa que todo está bien", "Se usa para confirmar un acuerdo o tranquilizar a alguien", "Parte del habla cotidiana dominicana"] },
    { palabra: "Qué lo que", pistas: ["Saludo dominicano informal equivalente a '¿qué hay?'", "Se dice entre amigos y conocidos", "Una de las frases más representativas del español dominicano"] },
    { palabra: "Gallística", pistas: ["Deporte tradicional de peleas de gallos", "Muy popular en el campo dominicano", "Las galleras son los lugares donde se celebran las peleas"] },
    { palabra: "Cerámica taína", pistas: ["Artesanía basada en los diseños originales de los indígenas taínos", "Reproduce figuras, duhos y cemíes de la cultura precolombina", "Se vende en mercados artesanales de todo el país"] },
    { palabra: "El almuerzo de los domingos", pistas: ["La comida familiar más importante de la semana dominicana", "Suele incluir sancocho, arroz con pollo o carne guisada", "Toda la familia se reúne, incluyendo tíos y primos"] },
    { palabra: "Tigueraje", pistas: ["Actitud de astucia y picardía del dominicano de la calle", "Un 'tíguere' es alguien que sabe cómo moverse en la vida", "Parte del carácter popular dominicano urbano"] },
  ],

  anime: [
    { palabra: "Dragon Ball Z", pistas: ["Goku y sus amigos defienden la Tierra de villanos cada vez más poderosos", "Las peleas duran varios capítulos y hay mucho gritando para cargar energía", "Las esferas de dragón conceden cualquier deseo al reunirse las 7"] },
    { palabra: "Naruto", pistas: ["Un ninja huérfano con un demonio de nueve colas sellado en su cuerpo", "Su sueño es ser el Hokage, líder de su aldea", "El Rasengan y el Jutsu de Clonación son sus técnicas favoritas"] },
    { palabra: "One Piece", pistas: ["Un pirata con cuerpo de goma busca el tesoro más grande del mundo", "Su tripulación incluye un espadachín, una navegante y un cocinero", "El One Piece es la promesa de que la Gran Era de los Piratas existe"] },
    { palabra: "Attack on Titan", pistas: ["La humanidad vive detrás de muros gigantes para protegerse de titanes", "El protagonista Eren puede convertirse en titán", "Mezcla acción, política y giros de trama impactantes"] },
    { palabra: "Death Note", pistas: ["Un cuaderno que mata a cualquiera cuyo nombre se escriba en él", "Light Yagami quiere crear un mundo perfecto sin criminales", "El detective L es su rival intelectual en un juego de ingenio"] },
    { palabra: "Demon Slayer", pistas: ["Un joven entrena para ser cazador de demonios y salvar a su hermana convertida en demonio", "Las espadas de agua y fuego son las técnicas más reconocidas", "La animación del estudio Ufotable es visualmente espectacular"] },
    { palabra: "My Hero Academia", pistas: ["En un mundo donde casi todos tienen superpoderes llamados Quirks", "Izuku Midoriya nació sin poderes pero los obtiene de su ídolo", "Los estudiantes entrenan para convertirse en héroes profesionales"] },
    { palabra: "Jujutsu Kaisen", pistas: ["Un estudiante traga un dedo maldito y obtiene poderes de un demonio ancestral", "Mezcla hechiceros, maldiciones y combates muy dinámicos", "Gojo Satoru es el personaje favorito de casi todos los fans"] },
    { palabra: "One Punch Man", pistas: ["Un héroe que puede derrotar a cualquier enemigo con un solo puñetazo", "Su mayor problema es el aburrimiento porque nadie le da batalla", "Mezcla parodia de superhéroes con acción extrema"] },
    { palabra: "Fullmetal Alchemist", pistas: ["Dos hermanos usan alquimia y pagan un precio terrible por intentar revivir a su madre", "Uno pierde el brazo y la pierna, el otro su cuerpo entero", "La ley de la alquimia es: para obtener algo, debes dar algo de igual valor"] },
    { palabra: "Goku", pistas: ["El saiyajin más poderoso del universo de Dragon Ball", "Empezó siendo bebé enviado a la Tierra para destruirla pero se volvió héroe", "Sus transformaciones van del Super Saiyajin hasta Ultra Instinto"] },
    { palabra: "Kamehameha", pistas: ["El ataque más icónico de Dragon Ball, una ola de energía azul", "Se carga juntando las manos al costado", "El Maestro Roshi lo inventó, Goku lo aprendió de niño viéndolo una sola vez"] },
    { palabra: "Sharingan", pistas: ["El ojo místico del clan Uchiha en Naruto", "Da la capacidad de copiar técnicas y predecir movimientos", "Sasuke y Itachi son sus usuarios más famosos"] },
    { palabra: "Shonen", pistas: ["Género de anime dirigido a adolescentes varones", "Los protagonistas suelen crecer superando sus límites", "Naruto, One Piece y Dragon Ball son ejemplos clásicos"] },
  ],

  videojuegos: [
    { palabra: "GTA San Andreas", pistas: ["Juegas como CJ en Los Santos tratando de recuperar el honor de su banda", "Salió en 2004 y fue el más jugado en los cibers dominicanos de esa era", "Puedes nadar, volar aviones y reclutar pandilleros"] },
    { palabra: "GTA V", pistas: ["Tres personajes jugables en una ciudad enorme basada en Los Ángeles", "Tiene modo en línea donde puedes hacer misiones con amigos", "Uno de los videojuegos más vendidos de la historia"] },
    { palabra: "Free Fire", pistas: ["Battle royale para celular muy popular en RD y Latinoamérica", "50 jugadores caen en una isla y el último en pie gana", "Las partidas duran unos 10 minutos y puedes jugar gratis"] },
    { palabra: "Minecraft", pistas: ["Juego de bloques donde puedes construir lo que imagines", "Tiene modo supervivencia donde debes comer y evitar monstruos de noche", "El Creeper es su enemigo más icónico y explotador"] },
    { palabra: "Fortnite", pistas: ["Battle royale donde puedes construir estructuras durante las peleas", "Tiene skins de personajes famosos de películas y música", "La tormenta se va cerrando y obliga a los jugadores a enfrentarse"] },
    { palabra: "Call of Duty", pistas: ["El shooter militar más jugado del mundo", "El modo Warzone es su versión battle royale gratuita", "Cada año sale una entrega nueva con diferentes épocas históricas"] },
    { palabra: "FIFA", pistas: ["El videojuego de fútbol más popular del mundo por décadas", "Ahora se llama EA Sports FC después de perder la licencia FIFA", "El modo Ultimate Team es el más adictivo para muchos"] },
    { palabra: "Mortal Kombat", pistas: ["Juego de peleas conocido por sus fatalities brutales", "Sub-Zero y Scorpion son sus personajes más icónicos", "La frase 'Finish him' es famosa en todo el mundo gamer"] },
    { palabra: "PlayStation 5", pistas: ["La consola de Sony más reciente y poderosa", "Su control tiene gatillos hápticos que se sienten diferentes según el juego", "Salió en 2020 y fue difícil de conseguir por meses"] },
    { palabra: "God of War", pistas: ["Kratos, el dios de la guerra griego, luego vive aventuras en la mitología nórdica", "La cámara no corta en todo el juego, siempre es un solo plano", "La relación entre padre e hijo es el corazón de la historia"] },
    { palabra: "Roblox", pistas: ["Plataforma de juegos donde los usuarios crean sus propios mundos", "Es especialmente popular entre niños y adolescentes", "Tiene su propia moneda virtual llamada Robux"] },
    { palabra: "Among Us", pistas: ["Juego de deducción donde uno o más impostores tratan de eliminar a la tripulación", "Se volvió viral en 2020 durante la pandemia", "La frase 'sospechoso' y el personaje de colores se hicieron meme"] },
    { palabra: "Headshot", pistas: ["Disparo que da justo en la cabeza del enemigo", "Generalmente elimina al rival de un solo tiro", "Los jugadores más hábiles en shooters se especializan en esto"] },
    { palabra: "Battle royale", pistas: ["Género donde muchos jugadores compiten hasta que queda uno solo", "El mapa se va reduciendo para obligar a los jugadores a encontrarse", "Fortnite, Free Fire y PUBG son los más famosos"] },
    { palabra: "Speedrun", pistas: ["Completar un videojuego en el menor tiempo posible", "Hay comunidades enteras dedicadas a encontrar los atajos más rápidos", "Los récords se rompen constantemente aprovechando glitches del juego"] },
  ]
};
