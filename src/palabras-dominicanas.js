// Base de datos de palabras dominicanas con pistas indirectas

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
 * Devuelve una pista aleatoria (palabra clave indirecta) de una palabra específica.
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
    { palabra: "Mangú", pistas: ["Aplastado", "Madrugada", "Verde"] },
    { palabra: "La Bandera", pistas: ["Mediodía", "Tres colores", "Diario"] },
    { palabra: "Sancocho", pistas: ["Reunión", "Leña", "Domingo"] },
    { palabra: "Tostones", pistas: ["Dos veces", "Aceite", "Verde"] },
    { palabra: "Yaroa", pistas: ["Santiago", "Derretido", "Noche"] },
    { palabra: "Pica pollo", pistas: ["Madrugada", "Colmado", "Crujiente"] },
    { palabra: "Locrio", pistas: ["Amarillo", "Ahumado", "Cazuela"] },
    { palabra: "Asopao", pistas: ["Gripe", "Caldoso", "Frío"] },
    { palabra: "Pastelón", pistas: ["Dulce y salado", "Horno", "Capas"] },
    { palabra: "Chivo guisado", pistas: ["Campo", "Lento", "Fiesta"] },
    { palabra: "Chicharrón de cerdo", pistas: ["Crujiente", "Limón", "Colmado"] },
    { palabra: "Longaniza", pistas: ["Humo", "Rojo", "Sartén"] },
    { palabra: "Salami", pistas: ["Rojo", "Mañana", "Sartén"] },
    { palabra: "Mofongo", pistas: ["Pilón", "Aplastado", "Ajo"] },
    { palabra: "Mondongo", pistas: ["Domingo", "Limón", "Tripas"] },
    { palabra: "Los Tres Golpes", pistas: ["Combinación", "Completo", "Mañana"] },
    { palabra: "Habichuelas con dulce", pistas: ["Cuaresma", "Frío", "Semana"] },
    { palabra: "Jalao", pistas: ["Pegajoso", "Dorado", "Navidad"] },
    { palabra: "Morir soñando", pistas: ["Espuma", "Naranja", "Cremoso"] },
    { palabra: "Mamajuana", pistas: ["Botella", "Palos", "Medicinal"] },
    { palabra: "Cerveza Presidente", pistas: ["Verde", "Fría", "Fiesta"] },
    { palabra: "Chinola", pistas: ["Ácida", "Amarilla", "Pasión"] },
    { palabra: "Lechosa", pistas: ["Naranja por dentro", "Semillas negras", "Tropical"] },
    { palabra: "Casabe", pistas: ["Crujiente", "Redondo", "Antiguo"] },
    { palabra: "Plátano maduro frito", pistas: ["Negro por fuera", "Dulce", "Aceite"] },
    { palabra: "Yuca", pistas: ["Blanca", "Dura", "Raíz"] },
    { palabra: "Batata", pistas: ["Morada", "Dulce", "Tierra"] },
    { palabra: "Café negro", pistas: ["Oscuro", "Amargo", "Madrugada"] },
  ],

  historia: [
    { palabra: "Juan Pablo Duarte", pistas: ["Joven", "Secreto", "Exilio"] },
    { palabra: "Francisco del Rosario Sánchez", pistas: ["Grito", "Puerta", "Noche"] },
    { palabra: "Matías Ramón Mella", pistas: ["Disparo", "Señal", "Noche"] },
    { palabra: "Las Hermanas Mirabal", pistas: ["Mariposas", "Carretera", "Noviembre"] },
    { palabra: "Gregorio Luperón", pistas: ["Caballo", "Norte", "Resistencia"] },
    { palabra: "27 de Febrero", pistas: ["Noche", "1844", "Grito"] },
    { palabra: "La Independencia", pistas: ["Separación", "Haití", "Libertad"] },
    { palabra: "La Restauración", pistas: ["Anexión", "Guerra", "Recuperación"] },
    { palabra: "La Trinitaria", pistas: ["Secreto", "Tres", "Conspiración"] },
    { palabra: "Zona Colonial", pistas: ["Adoquín", "Muralla", "Turismo"] },
    { palabra: "Rafael Leónidas Trujillo", pistas: ["Miedo", "Poder", "Dictadura"] },
    { palabra: "Enriquillo", pistas: ["Montaña", "Resistencia", "Cacique"] },
    { palabra: "Anacaona", pistas: ["Reina", "Canto", "Ejecución"] },
    { palabra: "Ocupación Norteamericana", pistas: ["Marines", "Invasión", "Soberanía"] },
    { palabra: "Puerta del Conde", pistas: ["Bandera", "Primer grito", "Parque"] },
    { palabra: "Joaquín Balaguer", pistas: ["Anciano", "Poder", "Constructor"] },
    { palabra: "Juan Bosch", pistas: ["Cuentos", "Derrocado", "Democracia"] },
    { palabra: "Revolución de Abril", pistas: ["Tanques", "Radio", "Constitución"] },
    { palabra: "Catedral Primada de América", pistas: ["Primera", "Piedra", "Siglos"] },
    { palabra: "Fortaleza Ozama", pistas: ["Cañones", "Río", "Cárcel"] },
  ],

  lugares: [
    { palabra: "Santo Domingo", pistas: ["Capital", "Río Ozama", "Fundada primero"] },
    { palabra: "Santiago de los Caballeros", pistas: ["Monumento", "Cibao", "Tabaco"] },
    { palabra: "Punta Cana", pistas: ["Palmeras", "Turistas", "Avión"] },
    { palabra: "Jarabacoa", pistas: ["Rafting", "Pino", "Frío"] },
    { palabra: "Constanza", pistas: ["Fresas", "Niebla", "Japoneses"] },
    { palabra: "Bahía de las Águilas", pistas: ["Virgen", "Bote", "Sur"] },
    { palabra: "Pico Duarte", pistas: ["Cumbre", "Frío", "Caminata"] },
    { palabra: "Lago Enriquillo", pistas: ["Cocodrilos", "Sal", "Bajo el mar"] },
    { palabra: "Samaná", pistas: ["Ballenas", "Enero", "Bote"] },
    { palabra: "Cabarete", pistas: ["Viento", "Tabla", "Norte"] },
    { palabra: "Isla Saona", pistas: ["Piscina natural", "Bote", "Turistas"] },
    { palabra: "Los Tres Ojos", pistas: ["Cueva", "Agua verde", "Capital"] },
    { palabra: "Altos de Chavón", pistas: ["Piedra", "Medieval", "Anfiteatro"] },
    { palabra: "El Malecón", pistas: ["Brisa", "Mar", "Noche"] },
    { palabra: "Valle del Cibao", pistas: ["Verde", "Agricultura", "Centro"] },
    { palabra: "Barahona", pistas: ["Larimar", "Sur", "Carretera larga"] },
    { palabra: "Boca Chica", pistas: ["Poco profundo", "Fin de semana", "Capital cerca"] },
    { palabra: "Cascada El Limón", pistas: ["Caballo", "Samaná", "Agua fría"] },
    { palabra: "Dajabón", pistas: ["Frontera", "Mercado", "Río"] },
    { palabra: "Pedernales", pistas: ["Lejos", "Sur", "Águilas"] },
  ],

  personajes: [
    { palabra: "Pedro Martínez", pistas: ["Dominante", "Boston", "Manoguayabo"] },
    { palabra: "David Ortiz", pistas: ["Grande", "Clutch", "Retirado"] },
    { palabra: "Juan Luis Guerra", pistas: ["Poesía", "Grammy", "Bachata pop"] },
    { palabra: "Romeo Santos", pistas: ["Bronx", "Rey", "Conciertos llenos"] },
    { palabra: "Fernando Tatis Jr.", pistas: ["Joven", "Espectacular", "Suspenso"] },
    { palabra: "Sammy Sosa", pistas: ["Jonrones", "Chicago", "Controversia"] },
    { palabra: "Félix Sánchez", pistas: ["Llanto", "Oro", "Vallas"] },
    { palabra: "Bartolo Colón", pistas: ["Eterno", "Robusto", "Economía"] },
    { palabra: "Johnny Ventura", pistas: ["Sombrero", "Político", "Clásico"] },
    { palabra: "Zoe Saldaña", pistas: ["Azul", "Espacio", "Hollywood"] },
    { palabra: "Michelle Rodríguez", pistas: ["Velocidad", "Dura", "Acción"] },
    { palabra: "Juan Bosch", pistas: ["Cuentos", "Traicionado", "Letras"] },
    { palabra: "Fefita la Grande", pistas: ["Acordeón", "Desde niña", "Carisma"] },
    { palabra: "El Alfa", pistas: ["Cadenas", "Barrio", "Millones"] },
    { palabra: "Tokischa", pistas: ["Polémica", "Los Mina", "Internacional"] },
    { palabra: "Oscar de la Renta", pistas: ["Elegancia", "París", "Vestidos"] },
    { palabra: "Karl-Anthony Towns", pistas: ["Alto", "NBA", "Dolor"] },
    { palabra: "Salomé Ureña", pistas: ["Versos", "Maestra", "Billete"] },
  ],

  artistas: [
    { palabra: "Johnny Ventura", pistas: ["Sombrero", "Coreografía", "Clásico"] },
    { palabra: "Wilfrido Vargas", pistas: ["Saxofón", "Fusión", "Descubridor"] },
    { palabra: "Fernando Villalona", pistas: ["Mayimbe", "Elegante", "Eterno"] },
    { palabra: "Romeo Santos", pistas: ["Fórmula", "Estadio lleno", "Suave"] },
    { palabra: "Juan Luis Guerra", pistas: ["Metáforas", "Berklee", "Ganador"] },
    { palabra: "El Alfa", pistas: ["Cadenas", "Ritmo rápido", "Viral"] },
    { palabra: "Cándido Bidó", pistas: ["Ojos grandes", "Colores vivos", "Lienzo"] },
    { palabra: "Pedro Mir", pistas: ["Exilio", "Versos", "País"] },
    { palabra: "Salomé Ureña", pistas: ["Siglo XIX", "Maestra", "Versos"] },
    { palabra: "Fefita la Grande", pistas: ["Fuelle", "Humor", "Grande"] },
    { palabra: "Los Hermanos Rosario", pistas: ["Familia", "Fiesta", "Orquesta"] },
    { palabra: "Anthony Santos", pistas: ["Sentimiento", "Guitarra", "Mayimbe"] },
    { palabra: "Natti Natasha", pistas: ["Urbana", "Premios", "Colaboraciones"] },
    { palabra: "Oscar de la Renta", pistas: ["Costura", "Reinas", "Mundo"] },
    { palabra: "Aventura", pistas: ["Grupo", "Bronx", "Obsesión"] },
  ],

  musica: [
    { palabra: "Merengue", pistas: ["Cadera", "Rápido", "Nacional"] },
    { palabra: "Bachata", pistas: ["Guitarra", "Desamor", "Barrio"] },
    { palabra: "Dembow", pistas: ["Acelerado", "Barrio", "Celular"] },
    { palabra: "Perico Ripiao", pistas: ["Fuelle", "Cibao", "Raíz"] },
    { palabra: "Tambora", pistas: ["Parche", "Golpe", "Ritmo"] },
    { palabra: "Güira", pistas: ["Raspado", "Metal", "Chiiic"] },
    { palabra: "Ojalá que llueva café", pistas: ["Deseo", "Campesino", "Lluvia"] },
    { palabra: "Obsesión", pistas: ["Viral", "Amor intenso", "Bachata pop"] },
    { palabra: "Salve", pistas: ["Rezo", "Vela", "Noche"] },
    { palabra: "Palos", pistas: ["Parche", "Sagrado", "Africano"] },
    { palabra: "Gagá", pistas: ["Batey", "Colorido", "Cuaresma"] },
    { palabra: "La Bilirrubina", pistas: ["Enfermedad de amor", "Análisis", "90s"] },
    { palabra: "Acordeón", pistas: ["Fuelle", "Alemania", "Cibao"] },
    { palabra: "Visa para un sueño", pistas: ["Rechazo", "Embajada", "Emigrar"] },
  ],

  deportes: [
    { palabra: "Béisbol", pistas: ["Guante", "Bate", "Sueño"] },
    { palabra: "LIDOM", pistas: ["Invierno", "Equipos", "Liga"] },
    { palabra: "Águilas Cibaeñas", pistas: ["Santiago", "Campeones", "Azul"] },
    { palabra: "Tigres del Licey", pistas: ["Capital", "Clásico", "Rivalidad"] },
    { palabra: "Pedro Martínez", pistas: ["Dominante", "Lancha", "Cy Young"] },
    { palabra: "David Ortiz", pistas: ["Apodo", "Series", "Bate"] },
    { palabra: "Félix Sánchez", pistas: ["Llanto", "Podio", "Vallas"] },
    { palabra: "Estadio Quisqueya", pistas: ["Noche", "Pelota", "Capital"] },
    { palabra: "Jonrón", pistas: ["Cuadrangular", "Aplausos", "Vuelo"] },
    { palabra: "Serie del Caribe", pistas: ["Febrero", "Caribe", "Campeones"] },
    { palabra: "Juan Soto", pistas: ["Millones", "Joven", "Ojo"] },
    { palabra: "Fernando Tatis Jr.", pistas: ["Hijo de", "Carisma", "Padres"] },
    { palabra: "Clásico Mundial", pistas: ["Países", "Orgullo", "Campeones"] },
    { palabra: "Al Horford", pistas: ["Alto", "Celtics", "Padre pelotero"] },
  ],

  festividades: [
    { palabra: "Carnaval", pistas: ["Disfraz", "Vejiga", "Calle"] },
    { palabra: "Diablo Cojuelo", pistas: ["Espejo", "Cuernos", "Golpe"] },
    { palabra: "Semana Santa", pistas: ["Playa", "Bacalao", "Velas"] },
    { palabra: "27 de Febrero", pistas: ["Desfile", "Azul y rojo", "Feriado"] },
    { palabra: "16 de Agosto", pistas: ["Desfile", "Restauración", "Feriado"] },
    { palabra: "Habichuelas con dulce", pistas: ["Fría o caliente", "Cuaresma", "Debate"] },
    { palabra: "Navidad dominicana", pistas: ["Pernil", "Diciembre", "Ruido"] },
    { palabra: "Parrandas navideñas", pistas: ["Madrugada", "Puerta", "Aguinaldo"] },
    { palabra: "Carnaval de La Vega", pistas: ["Domingos", "Colorido", "Antiguo"] },
    { palabra: "Fiestas patronales", pistas: ["Santo", "Pueblo", "Cohetes"] },
    { palabra: "La Altagracia", pistas: ["Virgen", "Higüey", "Enero"] },
    { palabra: "Día de la Altagracia", pistas: ["Peregrinación", "21", "Promesa"] },
    { palabra: "Los Reyes Magos", pistas: ["Enero", "Regalos", "Zapatos"] },
    { palabra: "Gagá de Semana Santa", pistas: ["Batey", "Viernes", "Colorido"] },
  ],

  tradiciones: [
    { palabra: "El colmado", pistas: ["Bocina", "Crédito", "Esquina"] },
    { palabra: "El motoconcho", pistas: ["Casco", "Rápido", "Pueblo"] },
    { palabra: "Jugar dominó", pistas: ["Ficha", "Mesa", "Golpe"] },
    { palabra: "El Ciguapa", pistas: ["Al revés", "Bosque", "Hermosa"] },
    { palabra: "El Bacá", pistas: ["Pacto", "Oscuro", "Rico"] },
    { palabra: "Larimar", pistas: ["Azul cielo", "Único", "Sur"] },
    { palabra: "Ámbar dominicano", pistas: ["Dorado", "Atrapado", "Millones de años"] },
    { palabra: "Volar chiringas", pistas: ["Viento", "Cielo", "Papel"] },
    { palabra: "El velorio", pistas: ["Café", "Noche larga", "Rezar"] },
    { palabra: "La quinceañera", pistas: ["Vals", "Corona", "Rosa"] },
    { palabra: "Tá to bien", pistas: ["Tranqui", "Acuerdo", "Dominicano"] },
    { palabra: "Qué lo que", pistas: ["Saludo", "Calle", "Informal"] },
    { palabra: "Gallística", pistas: ["Apuesta", "Plumas", "Arena"] },
    { palabra: "Cerámica taína", pistas: ["Barro", "Antiguo", "Museo"] },
    { palabra: "El almuerzo de los domingos", pistas: ["Reunión", "Olla grande", "Familia"] },
    { palabra: "Tigueraje", pistas: ["Viveza", "Calle", "Picardía"] },
  ],

  anime: [
    { palabra: "Dragon Ball Z", pistas: ["Poder", "Grito", "Esferas"] },
    { palabra: "Naruto", pistas: ["Aldea", "Ramen", "Naranja"] },
    { palabra: "One Piece", pistas: ["Mar", "Goma", "Sombrero de paja"] },
    { palabra: "Attack on Titan", pistas: ["Muros", "Carne", "Libertad"] },
    { palabra: "Death Note", pistas: ["Cuaderno", "Manzana", "Dios"] },
    { palabra: "Demon Slayer", pistas: ["Respiración", "Demonio", "Hermana"] },
    { palabra: "My Hero Academia", pistas: ["Escuela", "Superpoder", "Héroe"] },
    { palabra: "Jujutsu Kaisen", pistas: ["Maldición", "Estudiante", "Dedo"] },
    { palabra: "One Punch Man", pistas: ["Calvo", "Aburrido", "Invencible"] },
    { palabra: "Fullmetal Alchemist", pistas: ["Hermanos", "Brazo", "Transmutación"] },
    { palabra: "Goku", pistas: ["Cola", "Transformación", "Comer mucho"] },
    { palabra: "Kamehameha", pistas: ["Manos juntas", "Azul", "Onda"] },
    { palabra: "Sharingan", pistas: ["Rojo", "Ojo", "Copiar"] },
    { palabra: "Shonen", pistas: ["Joven", "Crecer", "Superar"] },
  ],

  videojuegos: [
    { palabra: "GTA San Andreas", pistas: ["Grove Street", "Bicicleta", "PS2"] },
    { palabra: "GTA V", pistas: ["Trevor", "Los Ángeles", "Atracos"] },
    { palabra: "Free Fire", pistas: ["Isla", "Celular", "10 minutos"] },
    { palabra: "Minecraft", pistas: ["Bloques", "Noche peligrosa", "Diamante"] },
    { palabra: "Fortnite", pistas: ["Construir", "Bus", "Baile"] },
    { palabra: "Call of Duty", pistas: ["Militar", "Lobby", "Prestige"] },
    { palabra: "FIFA", pistas: ["Fútbol", "Pack", "Ultimate"] },
    { palabra: "Mortal Kombat", pistas: ["Fatality", "Sangre", "Torneo"] },
    { palabra: "PlayStation 5", pistas: ["Blanca", "DualSense", "Difícil de conseguir"] },
    { palabra: "God of War", pistas: ["Hacha", "Hijo", "Mitología"] },
    { palabra: "Roblox", pistas: ["Robux", "Cuadrado", "Niños"] },
    { palabra: "Among Us", pistas: ["Impostor", "Votar", "Reunión"] },
    { palabra: "Headshot", pistas: ["Cabeza", "Instantáneo", "Puntería"] },
    { palabra: "Battle royale", pistas: ["Último", "Tormenta", "Solo"] },
    { palabra: "Speedrun", pistas: ["Reloj", "Glitch", "Récord"] },
  ],

  barrios: [
    { palabra: "Cristo Rey", pistas: ["Capital", "Concurrido", "Centro"] },
    { palabra: "Los Mina", pistas: ["Este", "Popular", "Grande"] },
    { palabra: "Villa Juana", pistas: ["Capital", "Antiguo", "Barrio"] },
    { palabra: "Capotillo", pistas: ["Norte", "Denso", "Capital"] },
    { palabra: "Gualey", pistas: ["Río", "Abajo", "Capital"] },
    { palabra: "La Ciénaga", pistas: ["Ribera", "Humilde", "Ozama"] },
    { palabra: "Guachupita", pistas: ["Capital", "Orilla", "Conocido"] },
    { palabra: "Villa Mella", pistas: ["Norte", "Carretera", "Palos"] },
    { palabra: "Los Alcarrizos", pistas: ["Oeste", "Municipio", "Grande"] },
    { palabra: "Naco", pistas: ["Residencial", "Elegante", "Capital"] },
    { palabra: "Piantini", pistas: ["Lujoso", "Restaurantes", "Capital"] },
    { palabra: "Gazcue", pistas: ["Colonial", "Tranquilo", "Histórico"] },
    { palabra: "Los Prados", pistas: ["Norte", "Residencial", "Familiar"] },
    { palabra: "Ensanche Ozama", pistas: ["Este", "Popular", "Nuevo"] },
    { palabra: "Herrera", pistas: ["Industria", "Oeste", "Fábricas"] },
    { palabra: "La Julia", pistas: ["Residencial", "Capital", "Clase media"] },
    { palabra: "San Carlos", pistas: ["Centro", "Antiguo", "Carnaval"] },
    { palabra: "Simón Bolívar", pistas: ["Avenida", "Capital", "Transitada"] },
    { palabra: "Pequeño Haití", pistas: ["Migrantes", "Mercado", "Capital"] },
    { palabra: "Los Cacicazgos", pistas: ["Lujoso", "Mar", "Exclusivo"] },
    { palabra: "Arroyo Hondo", pistas: ["Residencial", "Norte", "Tranquilo"] },
    { palabra: "La Fe", pistas: ["Villa Mella", "Popular", "Norte"] },
    { palabra: "Sabana Perdida", pistas: ["Norte", "Grande", "Popular"] },
    { palabra: "La Victoria", pistas: ["Cárcel", "Este", "Conocida"] },
    { palabra: "Villas Agrícolas", pistas: ["Norte", "Mercado", "Popular"] },
    { palabra: "Los Ríos", pistas: ["Residencial", "Capital", "Clase media"] },
  ],

  marcas: [
    { palabra: "Induveca", pistas: ["Salami", "Fábrica", "Rojo"] },
    { palabra: "Brugal", pistas: ["Ron", "Puerto Plata", "Botella"] },
    { palabra: "Presidente", pistas: ["Verde", "Fría", "Fiesta"] },
    { palabra: "La Sirena", pistas: ["Tienda", "Azul", "Barato"] },
    { palabra: "Jumbo", pistas: ["Supermercado", "Grande", "Moderno"] },
    { palabra: "Claro", pistas: ["Teléfono", "Rojo", "Señal"] },
    { palabra: "Altice", pistas: ["Cable", "Internet", "Televisión"] },
    { palabra: "El Conde", pistas: ["Peatonal", "Colonial", "Tiendas"] },
    { palabra: "Barceló", pistas: ["Ron", "Madera", "Añejo"] },
    { palabra: "Bermúdez", pistas: ["Ron", "Clásico", "Añejo"] },
    { palabra: "Malta Morena", pistas: ["Oscura", "Sin alcohol", "Botella"] },
    { palabra: "Vegetal", pistas: ["Jugo", "Verde", "Caja"] },
    { palabra: "Mercasid", pistas: ["Mercado", "Mayorista", "Santiago"] },
    { palabra: "Playero", pistas: ["Pan", "Bolsa", "Blanco"] },
    { palabra: "Rica", pistas: ["Leche", "Roja", "Vaca"] },
    { palabra: "Bohío", pistas: ["Ron", "Cañaveral", "Económico"] },
    { palabra: "Coral", pistas: ["Hipermercado", "Azul", "Grande"] },
    { palabra: "Banco Popular", pistas: ["Banco", "Rojo", "Dominicano"] },
    { palabra: "Banreservas", pistas: ["Banco", "Estado", "Dominicano"] },
    { palabra: "Caribe Tours", pistas: ["Bus", "Viaje", "Interprovincial"] },
    { palabra: "Metro Bus", pistas: ["Transporte", "Santo Domingo", "Ruta"] },
    { palabra: "Diario Libre", pistas: ["Periódico", "Gratis", "Digital"] },
    { palabra: "El Listín Diario", pistas: ["Periódico", "Antiguo", "Impreso"] },
    { palabra: "Super Pola", pistas: ["Supermercado", "Norte", "Santiago"] },
    { palabra: "Sirabo", pistas: ["Helado", "Carruchito", "Calle"] },
  ],

  youtubers: [
    { palabra: "El Dotol Nastra", pistas: ["Comedia", "Dominicano", "Viral"] },
    { palabra: "Raymond y sus Amigos", pistas: ["Comedia", "Personajes", "Sketches"] },
    { palabra: "La Ross Maria", pistas: ["Comedia", "Mujer", "Exagerada"] },
    { palabra: "Chichí y Rafaelito", pistas: ["Dúo", "TV dominicana", "Clásico"] },
    { palabra: "El Boza", pistas: ["Comedia", "Personajes", "Barrio"] },
    { palabra: "Alofoke", pistas: ["Noticias", "Farándula", "Radio"] },
    { palabra: "Buche y Pluma", pistas: ["Comedia", "Sketches", "Viral"] },
    { palabra: "Los Palotes", pistas: ["Comedia", "Dúo", "Personajes"] },
    { palabra: "Ceky Viciny", pistas: ["Urbano", "Viral", "Dembow"] },
    { palabra: "El Men Es News", pistas: ["Noticias", "Farándula", "Redes"] },
    { palabra: "Kiko El Crazy", pistas: ["Comedia", "Personajes", "Viral"] },
    { palabra: "Diomedes Núñez", pistas: ["Comedia", "Sketch", "Conocido"] },
    { palabra: "Sandy Reyes", pistas: ["Comedia", "TV", "Actor"] },
    { palabra: "Richy el Actor", pistas: ["Comedia", "Personajes", "TV"] },
    { palabra: "La Jessy", pistas: ["Comedia", "Mujer", "TV"] },
    { palabra: "Jochy Santos", pistas: ["TV", "Presentador", "Noche"] },
    { palabra: "Tavito Dominicano", pistas: ["Comedia", "Barrio", "Viral"] },
    { palabra: "Dj Scuff", pistas: ["Música", "Mezcla", "Fiesta"] },
    { palabra: "El Fua", pistas: ["Comedia", "Viral", "Redes"] },
    { palabra: "Naive Guerrero", pistas: ["Opinión", "Política", "Digital"] },
  ],
};
