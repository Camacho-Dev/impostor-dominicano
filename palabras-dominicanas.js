// Base de datos de palabras dominicanas organizadas por categorías
const palabrasDominicanas = {
    comida: [
        "Mangú", "Sancocho", "La Bandera", "Tostones", "Yaroa", "Chicharrón", 
        "Pastelitos", "Empanadas", "Habichuelas con dulce", "Arroz con leche",
        "Morir soñando", "Mamajuana", "Presidente", "Quisqueya", "Brugal",
        "Casabe", "Arepa", "Yuca", "Batata", "Chicharrón de pollo",
        "Pica pollo", "Chivo guisado", "Pescado con coco", "Asopao", "Locrio"
    ],
    expresiones: [
        "¡Qué lo que!", "Tato", "Vaina", "Jeva", "Tiguere", "Pana", 
        "Fula", "Chévere", "Guagua", "Colmado", "Zafacón", "Concho",
        "Yala", "Dale", "Ta'to", "Eso e' na'", "Dímelo", "Dale pa' allá",
        "Vacano", "Jevón", "Chévere", "Ta' bueno", "Eso ta' frío"
    ],
    lugares: [
        "Santo Domingo", "Santiago", "Punta Cana", "Bávaro", "La Romana",
        "Puerto Plata", "Sosúa", "Cabarete", "Jarabacoa", "Constanza",
        "Altos de Chavón", "Los Tres Ojos", "Alcázar de Colón", "Zona Colonial",
        "Malecón", "El Conde", "Pico Duarte", "Lago Enriquillo", "Isla Saona",
        "Bahía de las Águilas", "Cascada El Limón", "Cueva de las Maravillas"
    ],
    personajes: [
        "Juan Luis Guerra", "Oscar de la Renta", "Pedro Martínez", "David Ortiz",
        "Albert Pujols", "Samantha Báez", "Julio Iglesias Jr", "Natti Natasha",
        "Romeo Santos", "Aventura", "Juan Marichal", "Félix Sánchez",
        "Salomé Ureña", "Duarte", "Mella", "Sánchez", "Merengue", "Bachata"
    ],
    musica: [
        "Merengue", "Bachata", "Dembow", "Perico Ripiao", "Son", "Mambo",
        "Juan Luis Guerra", "Romeo Santos", "Aventura", "El Alfa", "Tokischa",
        "La Materialista", "Natti Natasha", "Chimbala", "Bolo", "El Prodigio",
        "Fefita la Grande", "Johnny Ventura", "Wilfrido Vargas", "Fernando Villalona"
    ],
    deportes: [
        "Béisbol", "Liga Dominicana", "Águilas Cibaeñas", "Tigres del Licey",
        "Leones del Escogido", "Estrellas Orientales", "Pedro Martínez",
        "David Ortiz", "Albert Pujols", "Vladimir Guerrero", "Manny Ramírez",
        "Samantha Báez", "Félix Sánchez", "Luisito Pie", "Boxeo", "Baloncesto"
    ],
    festividades: [
        "Carnaval", "Día de la Independencia", "Día de la Restauración",
        "Festival de Merengue", "Festival de Bachata", "Semana Santa",
        "Día de las Madres", "Navidad", "Año Nuevo", "Día de los Reyes",
        "Festival del Merengue", "Carnaval de La Vega", "Carnaval de Santiago"
    ],
    tradiciones: [
        "Gagá", "Palos", "Atabales", "Carnaval", "Máscaras", "Diablos Cojuelos",
        "Lechones", "Roba la Gallina", "Los Taimáscaros", "Guloyas", "Cachúas",
        "Vejigantes", "Comparsas", "Música de palos", "Salve", "Bachata"
    ]
};

// Función para obtener una palabra aleatoria de una categoría
function obtenerPalabraAleatoria(categoria) {
    if (categoria === "mezclado") {
        // Mezclar todas las categorías
        const todasLasPalabras = Object.values(palabrasDominicanas).flat();
        return todasLasPalabras[Math.floor(Math.random() * todasLasPalabras.length)];
    }
    
    const palabras = palabrasDominicanas[categoria];
    if (!palabras || palabras.length === 0) {
        return "Dominicano";
    }
    
    return palabras[Math.floor(Math.random() * palabras.length)];
}

// Función para obtener el nombre de la categoría
function obtenerNombreCategoria(categoria) {
    const nombres = {
        comida: "🍽️ Comida Dominicana",
        expresiones: "💬 Expresiones Dominicanas",
        lugares: "🗺️ Lugares de RD",
        personajes: "⭐ Personajes Dominicanos",
        musica: "🎵 Música Dominicana",
        deportes: "⚾ Deportes Dominicanos",
        festividades: "🎉 Festividades",
        tradiciones: "🎭 Tradiciones",
        mezclado: "🎲 Mezclado"
    };
    return nombres[categoria] || categoria;
}

