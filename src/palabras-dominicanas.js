// Base de datos de palabras dominicanas con pistas en palabras clave

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
 * Devuelve una pista aleatoria (palabra clave) de una palabra específica.
 */
export function obtenerPistaDepalabra(palabra) {
  const todas = Object.values(palabrasDominicanas).flat();
  const entrada = todas.find(p => (typeof p === 'string' ? p : p.palabra) === palabra);
  if (entrada && typeof entrada === 'object' && entrada.pistas && entrada.pistas.length > 0) {
    return entrada.pistas[Math.floor(Math.random() * entrada.pistas.length)];
  }
  return palabra;
}

/**
 * Genera una pista para el impostor basada en la palabra real.
 * El impostor recibe una palabra clave relacionada con la palabra secreta.
 */
export function generarPistaImpostor(palabraReal) {
  return obtenerPistaDepalabra(palabraReal);
}

/**
 * Genera múltiples pistas para varios impostores.
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
    { palabra: "Mangú", pistas: ["Plátano", "Desayuno", "Hervido"] },
    { palabra: "La Bandera", pistas: ["Arroz", "Almuerzo", "Habichuelas"] },
    { palabra: "Sancocho", pistas: ["Caldo", "Viandas", "Domingo"] },
    { palabra: "Tostones", pistas: ["Frito", "Plátano", "Crujiente"] },
    { palabra: "Yaroa", pistas: ["Papas", "Queso", "Carne"] },
    { palabra: "Pica pollo", pistas: ["Frito", "Crujiente", "Noche"] },
    { palabra: "Locrio", pistas: ["Arroz", "Salami", "Condimentos"] },
    { palabra: "Asopao", pistas: ["Sopa", "Arroz", "Caldo"] },
    { palabra: "Pastelón", pistas: ["Plátano maduro", "Carne molida", "Horneado"] },
    { palabra: "Chivo guisado", pistas: ["Chivo", "Campo", "Especias"] },
    { palabra: "Chicharrón de cerdo", pistas: ["Cerdo", "Crujiente", "Colmado"] },
    { palabra: "Longaniza", pistas: ["Embutido", "Cerdo", "Frito"] },
    { palabra: "Salami", pistas: ["Embutido", "Rojo", "Sartén"] },
    { palabra: "Mofongo", pistas: ["Pilón", "Chicharrón", "Aplastado"] },
    { palabra: "Mondongo", pistas: ["Tripas", "Sopa", "Domingo"] },
    { palabra: "Los Tres Golpes", pistas: ["Mangú", "Salami", "Desayuno"] },
    { palabra: "Habichuelas con dulce", pistas: ["Dulce", "Semana Santa", "Coco"] },
    { palabra: "Jalao", pistas: ["Coco", "Melao", "Pegajoso"] },
    { palabra: "Morir soñando", pistas: ["Naranja", "Leche", "Bebida"] },
    { palabra: "Mamajuana", pistas: ["Ron", "Hierbas", "Botella"] },
    { palabra: "Cerveza Presidente", pistas: ["Cerveza", "Verde", "Fría"] },
    { palabra: "Chinola", pistas: ["Fruta", "Ácida", "Jugo"] },
    { palabra: "Lechosa", pistas: ["Papaya", "Naranja", "Fruta"] },
    { palabra: "Casabe", pistas: ["Yuca", "Pan", "Taíno"] },
    { palabra: "Plátano maduro frito", pistas: ["Dulce", "Frito", "Maduros"] },
    { palabra: "Yuca", pistas: ["Tubérculo", "Hervida", "Mojo"] },
    { palabra: "Batata", pistas: ["Dulce", "Tubérculo", "Morada"] },
    { palabra: "Café negro", pistas: ["Caliente", "Cargado", "Mañana"] },
  ],

  historia: [
    { palabra: "Juan Pablo Duarte", pistas: ["Padre de la Patria", "Trinitaria", "Independencia"] },
    { palabra: "Francisco del Rosario Sánchez", pistas: ["Puerta del Conde", "Independencia", "Patriota"] },
    { palabra: "Matías Ramón Mella", pistas: ["Trabucazo", "Militar", "27 de febrero"] },
    { palabra: "Las Hermanas Mirabal", pistas: ["Mariposas", "Trujillo", "Noviembre"] },
    { palabra: "Gregorio Luperón", pistas: ["Restauración", "España", "General"] },
    { palabra: "27 de Febrero", pistas: ["Independencia", "1844", "Desfile"] },
    { palabra: "La Independencia", pistas: ["Haití", "1844", "Libertad"] },
    { palabra: "La Restauración", pistas: ["España", "Guerra", "Soberanía"] },
    { palabra: "La Trinitaria", pistas: ["Sociedad secreta", "Duarte", "Independencia"] },
    { palabra: "Zona Colonial", pistas: ["Patrimonio", "UNESCO", "Santo Domingo"] },
    { palabra: "Rafael Leónidas Trujillo", pistas: ["Dictador", "El Jefe", "Generalísimo"] },
    { palabra: "Enriquillo", pistas: ["Cacique", "Taíno", "Resistencia"] },
    { palabra: "Anacaona", pistas: ["Reina taína", "Poetisa", "Flor de oro"] },
    { palabra: "Ocupación Norteamericana", pistas: ["Marines", "1916", "Soberanía"] },
    { palabra: "Puerta del Conde", pistas: ["Bandera", "Independencia", "Parque"] },
    { palabra: "Joaquín Balaguer", pistas: ["Presidente", "Caudillo", "Doce años"] },
    { palabra: "Juan Bosch", pistas: ["Escritor", "PRD", "Democracia"] },
    { palabra: "Revolución de Abril", pistas: ["1965", "Constitución", "Marines"] },
    { palabra: "Catedral Primada de América", pistas: ["Primera", "Colonial", "Siglo XVI"] },
    { palabra: "Fortaleza Ozama", pistas: ["Militar", "Río Ozama", "Antigua"] },
  ],

  lugares: [
    { palabra: "Santo Domingo", pistas: ["Capital", "Ozama", "Colonial"] },
    { palabra: "Santiago de los Caballeros", pistas: ["Cibao", "Segunda ciudad", "Tabaco"] },
    { palabra: "Punta Cana", pistas: ["Playa", "Turismo", "Arena blanca"] },
    { palabra: "Jarabacoa", pistas: ["Montaña", "Río", "Frío"] },
    { palabra: "Constanza", pistas: ["Verduras", "Frío", "Valle"] },
    { palabra: "Bahía de las Águilas", pistas: ["Playa virgen", "Pedernales", "Bote"] },
    { palabra: "Pico Duarte", pistas: ["Montaña", "Caribe", "Cumbre"] },
    { palabra: "Lago Enriquillo", pistas: ["Cocodrilos", "Sal", "Lago"] },
    { palabra: "Samaná", pistas: ["Ballenas", "Península", "Palmeras"] },
    { palabra: "Cabarete", pistas: ["Kitesurf", "Norte", "Turistas"] },
    { palabra: "Isla Saona", pistas: ["Piscina natural", "La Romana", "Isla"] },
    { palabra: "Los Tres Ojos", pistas: ["Cuevas", "Lagunas", "Santo Domingo Este"] },
    { palabra: "Altos de Chavón", pistas: ["Medieval", "Anfiteatro", "La Romana"] },
    { palabra: "El Malecón", pistas: ["Mar", "Avenida", "Carnaval"] },
    { palabra: "Valle del Cibao", pistas: ["Fértil", "Agricultura", "Santiago"] },
    { palabra: "Barahona", pistas: ["Larimar", "Sur", "Playa"] },
    { palabra: "Boca Chica", pistas: ["Playa", "Capital", "Arrecife"] },
    { palabra: "Cascada El Limón", pistas: ["Catarata", "Samaná", "Caballo"] },
    { palabra: "Dajabón", pistas: ["Frontera", "Haití", "Mercado"] },
    { palabra: "Pedernales", pistas: ["Sur", "Remoto", "Frontera"] },
  ],

  personajes: [
    { palabra: "Pedro Martínez", pistas: ["Pitcher", "Cy Young", "Red Sox"] },
    { palabra: "David Ortiz", pistas: ["Big Papi", "Boston", "Jonrón"] },
    { palabra: "Juan Luis Guerra", pistas: ["Grammy", "Merengue", "Poeta"] },
    { palabra: "Romeo Santos", pistas: ["Bachata", "Aventura", "Rey"] },
    { palabra: "Fernando Tatis Jr.", pistas: ["Shortstop", "Padres", "Carisma"] },
    { palabra: "Sammy Sosa", pistas: ["Cubs", "Jonrones", "1998"] },
    { palabra: "Félix Sánchez", pistas: ["Olimpiadas", "Oro", "Vallas"] },
    { palabra: "Bartolo Colón", pistas: ["Lanzador", "20 temporadas", "Cy Young"] },
    { palabra: "Johnny Ventura", pistas: ["Merengue", "Caballo Mayor", "Político"] },
    { palabra: "Zoe Saldaña", pistas: ["Actriz", "Avatar", "Hollywood"] },
    { palabra: "Michelle Rodríguez", pistas: ["Fast & Furious", "Actriz", "Guerrera"] },
    { palabra: "Juan Bosch", pistas: ["Escritor", "Presidente", "PLD"] },
    { palabra: "Fefita la Grande", pistas: ["Acordeón", "Merengue típico", "Reina"] },
    { palabra: "El Alfa", pistas: ["Dembow", "Urbano", "El Jefe"] },
    { palabra: "Tokischa", pistas: ["Urbana", "Los Mina", "Provocadora"] },
    { palabra: "Oscar de la Renta", pistas: ["Diseñador", "Moda", "Paris"] },
    { palabra: "Karl-Anthony Towns", pistas: ["NBA", "Timberwolves", "Centro"] },
    { palabra: "Salomé Ureña", pistas: ["Poetisa", "Educadora", "Siglo XIX"] },
  ],

  artistas: [
    { palabra: "Johnny Ventura", pistas: ["Merengue", "Caballo Mayor", "Coreografía"] },
    { palabra: "Wilfrido Vargas", pistas: ["Merengue", "Fusión", "Barbarazo"] },
    { palabra: "Fernando Villalona", pistas: ["Mayimbe", "Merengue", "Voz"] },
    { palabra: "Romeo Santos", pistas: ["Bachata", "Fórmula", "Bronx"] },
    { palabra: "Juan Luis Guerra", pistas: ["Berklee", "Grammy", "Metáforas"] },
    { palabra: "El Alfa", pistas: ["Dembow", "Videoclips", "Jefe"] },
    { palabra: "Cándido Bidó", pistas: ["Pintor", "Ojos grandes", "Colores"] },
    { palabra: "Pedro Mir", pistas: ["Poeta nacional", "Exilio", "Trujillo"] },
    { palabra: "Salomé Ureña", pistas: ["Poetisa", "Billete", "Escuela"] },
    { palabra: "Fefita la Grande", pistas: ["Acordeón", "Niña", "Institución"] },
    { palabra: "Los Hermanos Rosario", pistas: ["Familia", "Merengue", "Orquesta"] },
    { palabra: "Anthony Santos", pistas: ["Bachata", "Mayimbe", "Desamor"] },
    { palabra: "Natti Natasha", pistas: ["Reguetón", "Urbana", "Premios"] },
    { palabra: "Oscar de la Renta", pistas: ["Vestidos", "Primera dama", "Alta costura"] },
    { palabra: "Aventura", pistas: ["Bachata", "Bronx", "Obsesión"] },
  ],

  musica: [
    { palabra: "Merengue", pistas: ["Nacional", "Tambora", "Cadera"] },
    { palabra: "Bachata", pistas: ["Guitarra", "Desamor", "UNESCO"] },
    { palabra: "Dembow", pistas: ["Urbano", "Acelerado", "El Alfa"] },
    { palabra: "Perico Ripiao", pistas: ["Cibao", "Típico", "Acordeón"] },
    { palabra: "Tambora", pistas: ["Tambor", "Merengue", "Dos parches"] },
    { palabra: "Güira", pistas: ["Metal", "Raspado", "Peinillo"] },
    { palabra: "Ojalá que llueva café", pistas: ["Juan Luis Guerra", "Campesino", "Canción"] },
    { palabra: "Obsesión", pistas: ["Aventura", "Viral", "Bachata"] },
    { palabra: "Salve", pistas: ["Religiosa", "Santos", "Velorio"] },
    { palabra: "Palos", pistas: ["Tambores", "Africano", "Ritual"] },
    { palabra: "Gagá", pistas: ["Haití", "Semana Santa", "Procesión"] },
    { palabra: "La Bilirrubina", pistas: ["Juan Luis Guerra", "Enfermedad", "Merengue"] },
    { palabra: "Acordeón", pistas: ["Fuelle", "Típico", "Cibao"] },
    { palabra: "Visa para un sueño", pistas: ["Juan Luis Guerra", "Emigrar", "Himno"] },
  ],

  deportes: [
    { palabra: "Béisbol", pistas: ["Nacional", "Grandes Ligas", "Pelota"] },
    { palabra: "LIDOM", pistas: ["Liga", "Invierno", "Profesional"] },
    { palabra: "Águilas Cibaeñas", pistas: ["Santiago", "Títulos", "Azul y rojo"] },
    { palabra: "Tigres del Licey", pistas: ["Santo Domingo", "Azul", "Rival"] },
    { palabra: "Pedro Martínez", pistas: ["Cy Young", "Red Sox", "Manoguayabo"] },
    { palabra: "David Ortiz", pistas: ["Boston", "Serie Mundial", "Número 34"] },
    { palabra: "Félix Sánchez", pistas: ["Atenas 2004", "Londres 2012", "Oro"] },
    { palabra: "Estadio Quisqueya", pistas: ["Santo Domingo", "LIDOM", "Taíno"] },
    { palabra: "Jonrón", pistas: ["Pelota", "Cuadrangular", "Carrera"] },
    { palabra: "Serie del Caribe", pistas: ["Febrero", "Caribe", "Invierno"] },
    { palabra: "Juan Soto", pistas: ["Contrato", "Washington", "Jardinero"] },
    { palabra: "Fernando Tatis Jr.", pistas: ["Padre pelotero", "Shortstop", "Carisma"] },
    { palabra: "Clásico Mundial", pistas: ["Internacional", "RD campeón", "2013"] },
    { palabra: "Al Horford", pistas: ["NBA", "Celtics", "Tito Horford"] },
  ],

  festividades: [
    { palabra: "Carnaval", pistas: ["Febrero", "Máscara", "Vejiga"] },
    { palabra: "Diablo Cojuelo", pistas: ["Carnaval", "Cuernos", "La Vega"] },
    { palabra: "Semana Santa", pistas: ["Playa", "Bacalao", "Religión"] },
    { palabra: "27 de Febrero", pistas: ["Independencia", "Desfile", "1844"] },
    { palabra: "16 de Agosto", pistas: ["Restauración", "Desfile", "1863"] },
    { palabra: "Habichuelas con dulce", pistas: ["Cuaresma", "Coco", "Postre"] },
    { palabra: "Navidad dominicana", pistas: ["Diciembre", "Pernil", "Familia"] },
    { palabra: "Parrandas navideñas", pistas: ["Aguinaldo", "Casas", "Instrumentos"] },
    { palabra: "Carnaval de La Vega", pistas: ["Diablos", "Domingos", "Famoso"] },
    { palabra: "Fiestas patronales", pistas: ["Santo patrón", "Pueblo", "Misa"] },
    { palabra: "La Altagracia", pistas: ["Virgen", "Higüey", "Patrona"] },
    { palabra: "Día de la Altagracia", pistas: ["21 de enero", "Peregrinación", "Higüey"] },
    { palabra: "Los Reyes Magos", pistas: ["6 de enero", "Regalos", "Niños"] },
    { palabra: "Gagá de Semana Santa", pistas: ["Bateyes", "Viernes Santo", "Procesión"] },
  ],

  tradiciones: [
    { palabra: "El colmado", pistas: ["Barrio", "Reunión", "Bebida"] },
    { palabra: "El motoconcho", pistas: ["Moto", "Transporte", "Pueblo"] },
    { palabra: "Jugar dominó", pistas: ["Fichas", "Colmado", "Equipo"] },
    { palabra: "El Ciguapa", pistas: ["Pies al revés", "Noche", "Mito"] },
    { palabra: "El Bacá", pistas: ["Pacto", "Riqueza", "Espíritu"] },
    { palabra: "Larimar", pistas: ["Azul", "Piedra", "RD"] },
    { palabra: "Ámbar dominicano", pistas: ["Resina", "Fósil", "Insecto"] },
    { palabra: "Volar chiringas", pistas: ["Semana Santa", "Cometa", "Cielo"] },
    { palabra: "El velorio", pistas: ["Difunto", "Noche", "Rezar"] },
    { palabra: "La quinceañera", pistas: ["15 años", "Vals", "Vestido"] },
    { palabra: "Tá to bien", pistas: ["Expresión", "Acuerdo", "Dominicano"] },
    { palabra: "Qué lo que", pistas: ["Saludo", "Informal", "Amigos"] },
    { palabra: "Gallística", pistas: ["Gallos", "Gallera", "Apuestas"] },
    { palabra: "Cerámica taína", pistas: ["Taíno", "Artesanía", "Precolombina"] },
    { palabra: "El almuerzo de los domingos", pistas: ["Familia", "Sancocho", "Domingo"] },
    { palabra: "Tigueraje", pistas: ["Picardía", "Calle", "Tíguere"] },
  ],

  anime: [
    { palabra: "Dragon Ball Z", pistas: ["Goku", "Esferas", "Guerreros"] },
    { palabra: "Naruto", pistas: ["Ninja", "Hokage", "Aldea"] },
    { palabra: "One Piece", pistas: ["Pirata", "Goma", "Tesoro"] },
    { palabra: "Attack on Titan", pistas: ["Muros", "Eren", "Gigantes"] },
    { palabra: "Death Note", pistas: ["Cuaderno", "Light", "Shinigami"] },
    { palabra: "Demon Slayer", pistas: ["Demonio", "Espada", "Hermana"] },
    { palabra: "My Hero Academia", pistas: ["Quirk", "Héroe", "Escuela"] },
    { palabra: "Jujutsu Kaisen", pistas: ["Maldición", "Gojo", "Hechicero"] },
    { palabra: "One Punch Man", pistas: ["Un golpe", "Calvo", "Héroe"] },
    { palabra: "Fullmetal Alchemist", pistas: ["Alquimia", "Hermanos", "Equivalencia"] },
    { palabra: "Goku", pistas: ["Saiyajin", "Super Saiyajin", "Kamehameha"] },
    { palabra: "Kamehameha", pistas: ["Energía azul", "Goku", "Manos al costado"] },
    { palabra: "Sharingan", pistas: ["Ojo", "Uchiha", "Sasuke"] },
    { palabra: "Shonen", pistas: ["Género", "Adolescente", "Superar límites"] },
  ],

  videojuegos: [
    { palabra: "GTA San Andreas", pistas: ["CJ", "Los Santos", "2004"] },
    { palabra: "GTA V", pistas: ["Tres personajes", "Los Ángeles", "Online"] },
    { palabra: "Free Fire", pistas: ["Celular", "Isla", "Battle royale"] },
    { palabra: "Minecraft", pistas: ["Bloques", "Creeper", "Construir"] },
    { palabra: "Fortnite", pistas: ["Construir", "Tormenta", "Skins"] },
    { palabra: "Call of Duty", pistas: ["Militar", "Warzone", "Shooter"] },
    { palabra: "FIFA", pistas: ["Fútbol", "EA Sports", "Ultimate Team"] },
    { palabra: "Mortal Kombat", pistas: ["Fatality", "Scorpion", "Sub-Zero"] },
    { palabra: "PlayStation 5", pistas: ["Sony", "Gatillos", "Consola"] },
    { palabra: "God of War", pistas: ["Kratos", "Mitología", "Padre e hijo"] },
    { palabra: "Roblox", pistas: ["Robux", "Niños", "Mundos"] },
    { palabra: "Among Us", pistas: ["Impostor", "Nave", "Viral"] },
    { palabra: "Headshot", pistas: ["Cabeza", "Un tiro", "Shooter"] },
    { palabra: "Battle royale", pistas: ["Último en pie", "Mapa", "Tormenta"] },
    { palabra: "Speedrun", pistas: ["Rápido", "Récord", "Glitch"] },
  ]
};
