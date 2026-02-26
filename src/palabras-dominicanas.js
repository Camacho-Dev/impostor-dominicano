// Base de datos de palabras dominicanas - solo palabras que un dominicano de pura cepa reconoce

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
  return lista[Math.floor(Math.random() * lista.length)];
}

/**
 * Genera una pista falsa para el impostor (una palabra aleatoria diferente).
 */
export function generarPistaImpostor(palabraReal) {
  const todas = Object.values(palabrasDominicanas).flat();
  const opciones = todas.filter(p => p !== palabraReal);
  return opciones[Math.floor(Math.random() * opciones.length)];
}

/**
 * Genera múltiples pistas falsas para varios impostores.
 */
export function generarPistasImpostores(palabraReal, cantidad) {
  const todas = Object.values(palabrasDominicanas).flat();
  const opciones = todas.filter(p => p !== palabraReal);
  const pistas = [];
  for (let i = 0; i < cantidad; i++) {
    pistas.push(opciones[Math.floor(Math.random() * opciones.length)]);
  }
  return pistas;
}

export const palabrasDominicanas = {

  comida: [
    // Platos principales
    "Mangú", "La Bandera", "Sancocho", "Tostones", "Yaroa",
    "Pica pollo", "Locrio", "Asopao", "Pastelón", "Chivo guisado",
    "Pollo guisado", "Carne guisada", "Chicharrón de cerdo", "Chicharrón de pollo",
    "Longaniza", "Salami", "Pescado con coco", "Bacalao guisado", "Lambí guisado",
    "Mofongo", "Casabe", "Arepa dominicana", "Pastelitos de hoja", "Empanadas de yuca",
    "Chuleta con papas", "Bistec encebollado", "Res guisada", "Sopa de pollo",
    "Mondongo", "Sopa de habichuelas", "Puerco asado", "Lechón asado",
    "Pierna de cerdo", "Costillas de cerdo", "Chivo liniero", "Pollo al carbón",
    "Plátano hervido", "Plátano maduro frito", "Tostones rellenos", "Maduros",
    // Desayuno
    "Los Tres Golpes", "Mangú con huevos", "Yuca hervida", "Batata hervida",
    "Huevos revueltos", "Queso frito", "Aguacate con sal",
    // Dulces y postres
    "Habichuelas con dulce", "Arroz con leche", "Majarete", "Jalao",
    "Dulce de coco", "Dulce de leche", "Dulce de batata", "Coco rayado",
    "Tembleque", "Bienmesabe", "Flan de coco", "Buñuelos",
    // Bebidas
    "Morir soñando", "Jugo de chinola", "Agua de coco", "Malta Morena",
    "Mamajuana", "Cerveza Presidente", "Ron Brugal", "Ron Barceló",
    "Café negro", "Café con leche", "Jugo de tamarindo", "Limoncillo",
    // Frutas y viandas típicas
    "Chinola", "Zapote", "Mamey", "Guanábana", "Limoncillo",
    "Cajuil", "Jobo", "Caimito", "Níspero", "Lechosa",
    "Yuca", "Batata", "Yautía", "Ñame", "Auyama",
    "Guineo", "Plátano verde", "Ají caballero", "Ají cachucha"
  ],

  historia: [
    // Padres de la Patria y héroes
    "Juan Pablo Duarte", "Francisco del Rosario Sánchez", "Matías Ramón Mella",
    "Gregorio Luperón", "Ulises Heureaux", "Máximo Gómez",
    "Enriquillo", "Anacaona", "Caonabo", "Guarionex", "Hatuey",
    "Las Hermanas Mirabal", "Patria Mirabal", "Dedé Mirabal",
    "Minerva Mirabal", "María Teresa Mirabal",
    // Fechas y eventos clave
    "27 de Febrero", "16 de Agosto", "La Independencia", "La Restauración",
    "La Trinitaria", "El Trinitario", "La Filantrópica",
    "Acta de Independencia", "Puerta del Conde", "Altar de la Patria",
    "Guerra de la Restauración", "Revolución de Abril",
    "Ocupación Haitiana", "Ocupación Norteamericana",
    // Presidentes
    "Rafael Leónidas Trujillo", "Joaquín Balaguer", "Juan Bosch",
    "Antonio Guzmán", "Salvador Jorge Blanco", "Leonel Fernández",
    "Hipólito Mejía", "Danilo Medina", "Luis Abinader",
    // Lugares históricos
    "Zona Colonial", "Alcázar de Colón", "Panteón Nacional",
    "Fortaleza Ozama", "Fuerte de San Felipe", "Casa de Tostado",
    "Museo de las Casas Reales", "Catedral Primada de América",
    "La Puerta del Conde", "El Conde",
    // Cultura y política
    "Partido Reformista", "Partido Revolucionario Dominicano",
    "Partido de la Liberación Dominicana", "Constitución de San Cristóbal",
    "La Era de Trujillo", "Los Doce Años", "Movimiento 14 de Junio",
    "SIM", "El Jefe", "Palacio Nacional", "Congreso Nacional"
  ],

  lugares: [
    // Ciudades principales
    "Santo Domingo", "Santiago de los Caballeros", "Punta Cana",
    "La Romana", "Puerto Plata", "San Pedro de Macorís",
    "San Francisco de Macorís", "La Vega", "Moca", "Baní",
    "Barahona", "Azua", "Samaná", "Nagua", "Bonao",
    "Cotuí", "San Juan de la Maguana", "Constanza", "Jarabacoa",
    "Dajabón", "Monte Cristi", "Pedernales",
    // Playas y costas
    "Boca Chica", "Juan Dolio", "Bayahibe", "Las Terrenas",
    "Cabarete", "Sosúa", "Cabrera", "Las Galeras",
    "Bahía de las Águilas", "Playa Rincón", "Playa Macao",
    "Isla Saona", "Cayo Levantado", "Isla Catalina", "Isla Beata",
    // Naturaleza y montañas
    "Pico Duarte", "Valle de Constanza", "Lago Enriquillo",
    "Laguna de Oviedo", "Isla Cabritos", "Los Tres Ojos",
    "Cascada El Limón", "Cueva de las Maravillas",
    "Cordillera Central", "Valle del Cibao",
    "Río Yaque del Norte", "Río Ozama",
    // Lugares emblemáticos
    "El Malecón", "La Zona Colonial", "El Conde",
    "Plaza de la Cultura", "Teatro Nacional", "Jardín Botánico Nacional",
    "Zoológico Nacional", "Acuario Nacional", "Faro a Colón",
    "Altos de Chavón", "Los Tres Ojos", "Mirador del Norte",
    // Barrios conocidos
    "Gascue", "Piantini", "Naco", "Los Prados",
    "Villa Juana", "Los Mina", "Los Alcarrizos",
    "Villa Mella", "Cristo Rey", "Capotillo"
  ],

  personajes: [
    // Béisbol (los más conocidos)
    "Pedro Martínez", "David Ortiz", "Albert Pujols",
    "Vladimir Guerrero", "Manny Ramírez", "Robinson Canó",
    "Adrián Beltré", "José Reyes", "Bartolo Colón",
    "Juan Marichal", "Sammy Sosa", "Nelson Cruz",
    "Edwin Encarnación", "Fernando Tatis Jr.", "Wander Franco",
    "Jorge Mateo", "Juan Soto",
    // Música
    "Juan Luis Guerra", "Romeo Santos", "Aventura",
    "Johnny Ventura", "Wilfrido Vargas", "Fernando Villalona",
    "Chichí Peralta", "El Alfa", "Natti Natasha",
    "Tokischa", "El Prodigio", "Fefita la Grande",
    "Tatico Henríquez", "Cuco Valoy", "Los Hermanos Rosario",
    "Anthony Santos", "Frank Reyes", "Raulín Rodríguez",
    "Monchy y Alexandra", "Zacarias Ferreira",
    // Deportes otros
    "Félix Sánchez", "Luguelín Santos", "Al Horford",
    "Karl-Anthony Towns", "Samantha Báez",
    // Cultura y TV
    "Chichí Peralta", "Sandy Reyes", "Richy",
    "La Jessy", "Anabel Medina", "Jochy Santos",
    "Rafael Corporán", "Freddy Beras Goico", "Jineika Espaillat",
    // Historia
    "Duarte", "Sánchez", "Mella", "Luperón",
    "Trujillo", "Balaguer", "Juan Bosch",
    "Las Mirabal", "Pedro Henríquez Ureña", "Salomé Ureña",
    // Actores / famosos
    "Michelle Rodríguez", "Zoe Saldaña", "Dania Ramírez",
    "Dascha Polanco", "Amara la Negra", "Oscar de la Renta"
  ],

  artistas: [
    // Músicos de merengue
    "Johnny Ventura", "Wilfrido Vargas", "Fernando Villalona",
    "Sergio Vargas", "Chichí Peralta", "Los Hermanos Rosario",
    "Pochy y su Cocoband", "Los Toros Band", "Toño Rosario",
    "Rubby Pérez", "Jossie Esteban", "El Prodigio",
    "Fefita la Grande", "Tatico Henríquez", "Cuco Valoy",
    "Francisco Ulloa", "La Patrulla 15",
    // Músicos de bachata
    "Romeo Santos", "Aventura", "Anthony Santos",
    "Frank Reyes", "Joe Veras", "Luis Vargas",
    "Raulín Rodríguez", "Yoskar Sarante", "Zacarias Ferreira",
    "Monchy y Alexandra", "El Chaval de la Bachata",
    "Teodoro Reyes", "Elvis Martínez",
    // Urbano / moderno
    "Juan Luis Guerra", "El Alfa", "Tokischa",
    "Natti Natasha", "La Materialista", "Chimbala",
    "Prince Royce", "Leslie Grace",
    // Pintores y artistas visuales
    "Cándido Bidó", "Guillo Pérez", "Ramón Oviedo",
    "Yoryi Morel", "Jaime Colson", "Celeste Woss y Gil",
    "Dario Suro", "Iván Tovar",
    // Escritores y poetas
    "Pedro Henríquez Ureña", "Salomé Ureña", "Pedro Mir",
    "Juan Bosch", "Marcio Veloz Maggiolo",
    "Gastón Fernando Deligne", "Fabio Fiallo",
    // Actores
    "Michelle Rodríguez", "Zoe Saldaña", "Dascha Polanco",
    "Amara la Negra", "María Montez",
    // Diseñadores
    "Oscar de la Renta"
  ],

  musica: [
    // Géneros dominicanos
    "Merengue", "Bachata", "Dembow", "Perico Ripiao",
    "Merengue típico", "Merengue de calle", "Salve",
    "Gagá", "Palos", "Mangulina", "Carabiné",
    // Artistas icónicos
    "Juan Luis Guerra", "Romeo Santos", "Johnny Ventura",
    "Wilfrido Vargas", "Fernando Villalona", "El Alfa",
    "Tokischa", "Natti Natasha", "Anthony Santos",
    "Frank Reyes", "Los Hermanos Rosario", "Aventura",
    "Chichí Peralta", "El Prodigio", "Fefita la Grande",
    "Tatico Henríquez", "Cuco Valoy", "Francisco Ulloa",
    // Canciones icónicas
    "Ojalá que llueva café", "La Bilirrubina", "El Costo de la Vida",
    "Visa para un sueño", "Burbujas de Amor", "Rosalía",
    "Obsesión", "Corazón sin cara",
    // Instrumentos típicos
    "Tambora", "Güira", "Acordeón", "Tambor de palo",
    "Balsié", "Pandero", "Atabales",
    // Conceptos musicales dominicanos
    "Parang", "Son dominicano", "Música típica",
    "Música de palo", "Música de salve", "Banda de música",
    // Lugares de música
    "Estadio Olímpico", "Palacio de los Deportes",
    "El Nacional", "Anfiteatro"
  ],

  deportes: [
    // Béisbol (el deporte nacional)
    "Béisbol", "LIDOM", "Serie del Caribe", "Clásico Mundial",
    "Águilas Cibaeñas", "Tigres del Licey", "Leones del Escogido",
    "Estrellas Orientales", "Gigantes del Cibao", "Toros del Este",
    "Estadio Quisqueya", "Estadio Cibao", "Estadio Tetelo Vargas",
    "Pedro Martínez", "David Ortiz", "Bartolo Colón",
    "Robinson Canó", "Adrián Beltré", "Juan Marichal",
    "Vladimir Guerrero", "Sammy Sosa", "Juan Soto",
    "Fernando Tatis Jr.", "Wander Franco",
    // Otros deportes
    "Boxeo dominicano", "Baloncesto", "Fútbol dominicano",
    "Voleibol", "Atletismo dominicano",
    // Deportistas destacados
    "Félix Sánchez", "Luguelín Santos", "Al Horford",
    "Karl-Anthony Towns", "Samantha Báez",
    "Petión Gutiérrez", "Luisito Pie",
    // Conceptos
    "Jonrón", "Picheo", "Bateo", "Inning", "Out",
    "Strike", "Home run", "Base robada",
    "Lanzador", "Receptor", "Jardinero", "Shortstop"
  ],

  festividades: [
    // Fiestas nacionales
    "27 de Febrero", "16 de Agosto", "Día de la Independencia",
    "Día de la Restauración", "Día de la Constitución",
    "Día de la Altagracia", "Día de Duarte",
    // Carnaval
    "Carnaval", "Carnaval de La Vega", "Carnaval de Santiago",
    "Carnaval de Santo Domingo", "Diablo Cojuelo",
    "Los Roba la Gallina", "Los Lechones", "Los Califé",
    "Los Taimáscaros", "Los Papeluses", "Los Diablos",
    "Vejigantes", "Máscara de carnaval",
    // Semana Santa
    "Semana Santa", "Viernes Santo", "Domingo de Resurrección",
    "Procesión de Semana Santa",
    // Navidad y Año Nuevo
    "Navidad dominicana", "Nochebuena", "Año Nuevo",
    "Los Reyes Magos", "Parrandas navideñas",
    "Aguinaldo", "Ensalada de Año Nuevo",
    // Festividades religiosas / populares
    "Fiestas patronales", "La Altagracia", "La Merced",
    "San Andrés", "Cruz de Mayo", "Día de los Muertos",
    "La Cachúa de Cabral", "La Fiesta de San Juan",
    "Gagá de Semana Santa", "Baile de palos"
  ],

  tradiciones: [
    // Costumbres cotidianas
    "El chin", "El motoconcho", "El concho", "El colmado",
    "La fiesta patronal", "El velorio", "La novena",
    "El bautizo", "La primera comunión", "La quinceañera",
    "El sancocho de 7 carnes", "El grillete",
    // Dichos y frases
    "Tá to bien", "Qué lo que", "Tranki", "Manya",
    "Vaina", "Chercha", "Bulla", "Tigueraje",
    "Jevita", "Jeva", "Broki", "Yola",
    // Costumbres sociales
    "Ir al colmado", "Jugar dominó", "Jugar gallística",
    "La gallera", "El béisbol de barrio", "Jugar trompo",
    "Jugar yoyo", "Jugar bolas", "Volar chiringas",
    "El sillón en la acera", "La visita del domingo",
    "El almuerzo de los domingos", "La familia numerosa",
    // Creencias y folklore
    "El Ciguapa", "El Bacá", "El Galipote", "La Zángano",
    "La Baca", "El Diablo Cojuelo", "Los espíritus",
    "El mal de ojo", "La brujería dominicana",
    "Salve dominicana", "Los palos del difunto",
    // Artesanías y cultura material
    "Larimar", "Ámbar dominicano", "Vejiga de carnaval",
    "Artesanía de higüero", "Silla mecedora",
    "Cerámica taína", "Petroglifo"
  ],

  anime: [
    "Dragon Ball Z", "Naruto", "One Piece", "Bleach", "Attack on Titan",
    "Death Note", "Fullmetal Alchemist", "Hunter x Hunter", "Demon Slayer",
    "My Hero Academia", "Sword Art Online", "Fairy Tail", "Black Clover",
    "Tokyo Ghoul", "Re:Zero", "Overlord", "That Time I Got Reincarnated as a Slime",
    "Mob Psycho 100", "One Punch Man", "Jujutsu Kaisen",
    "Cowboy Bebop", "Samurai Champloo", "Neon Genesis Evangelion",
    "Code Geass", "Steins Gate", "No Game No Life",
    "Sword Art Online", "Log Horizon", "Konosuba",
    "Goku", "Vegeta", "Naruto Uzumaki", "Sasuke Uchiha",
    "Luffy", "Zoro", "Ichigo Kurosaki", "Eren Yeager",
    "Light Yagami", "L Lawliet", "Edward Elric", "Killua",
    "Tanjiro Kamado", "Nezuko", "Izuku Midoriya", "All Might",
    "Levi Ackerman", "Mikasa Ackerman", "Rimuru Tempest",
    "Saitama", "Genos", "Yuji Itadori", "Sukuna",
    "Kamehameha", "Rasengan", "Sharingan", "Bankai",
    "Titan", "Hollow", "Chakra", "Quirk",
    "Shonen", "Shoujo", "Seinen", "Isekai",
    "Manga", "Cosplay", "Opening", "OVA"
  ],

  videojuegos: [
    // Juegos populares en RD
    "GTA San Andreas", "GTA V", "Free Fire", "PUBG",
    "Call of Duty", "Fortnite", "Minecraft", "Roblox",
    "FIFA", "eFootball", "NBA 2K", "Mortal Kombat",
    "God of War", "Spider-Man", "The Last of Us",
    "Red Dead Redemption", "Cyberpunk 2077",
    "League of Legends", "Valorant", "Among Us",
    "Counter Strike", "DOTA 2",
    // Consolas
    "PlayStation 5", "PlayStation 4", "Xbox Series X",
    "Nintendo Switch", "PlayStation 2", "PlayStation 3",
    "Game Boy", "Nintendo 64",
    // Personajes icónicos
    "Mario", "Link", "Pikachu", "Sonic",
    "Master Chief", "Kratos", "Nathan Drake",
    "Cloud Strife", "Lara Croft", "Solid Snake",
    "Sub-Zero", "Scorpion", "Shang Tsung",
    // Conceptos de juegos
    "Respawn", "Headshot", "Lag", "Cheat",
    "Glitch", "Noob", "Pro gamer", "Speedrun",
    "Battle royale", "Open world", "RPG",
    "First person shooter", "Hack and slash",
    "Level up", "Boss final", "Easter egg"
  ]
};
