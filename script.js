// Estado del juego
let estadoJuego = {
    jugadores: [],
    numJugadores: 5,
    categoria: 'comida',
    rondaActual: 1,
    jugadorActual: 0,
    impostor: null,
    palabraSecreta: '',
    pistas: [],
    votos: {},
    puntuaciones: {},
    modoVotacion: false,
    modoAdivinanza: false,
    modoAcusacion: false
};

// Referencias a elementos del DOM
const pantallas = {
    inicio: document.getElementById('pantalla-inicio'),
    jugadores: document.getElementById('pantalla-jugadores'),
    juego: document.getElementById('pantalla-juego'),
    votacion: document.getElementById('pantalla-votacion'),
    adivinanza: document.getElementById('pantalla-adivinanza'),
    acusacion: document.getElementById('pantalla-acusacion'),
    resultados: document.getElementById('pantalla-resultados')
};

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
});

function inicializarEventos() {
    document.getElementById('btn-iniciar').addEventListener('click', iniciarConfiguracion);
    document.getElementById('btn-continuar').addEventListener('click', continuarJuego);
    document.getElementById('btn-volver-inicio').addEventListener('click', volverInicio);
    document.getElementById('btn-enviar-pista').addEventListener('click', enviarPista);
    document.getElementById('input-pista').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') enviarPista();
    });
    document.getElementById('btn-votar').addEventListener('click', iniciarVotacion);
    document.getElementById('btn-adivinar').addEventListener('click', iniciarAdivinanza);
    document.getElementById('btn-confirmar-adivinanza').addEventListener('click', confirmarAdivinanza);
    document.getElementById('btn-cancelar-adivinanza').addEventListener('click', cancelarAdivinanza);
    document.getElementById('btn-acusar').addEventListener('click', iniciarAcusacion);
    document.getElementById('btn-cancelar-acusacion').addEventListener('click', cancelarAcusacion);
    document.getElementById('btn-siguiente-ronda').addEventListener('click', siguienteRonda);
    document.getElementById('btn-nuevo-juego').addEventListener('click', nuevoJuego);
}

function iniciarConfiguracion() {
    const numJugadores = parseInt(document.getElementById('num-jugadores').value);
    const categoria = document.getElementById('categoria-select').value;
    
    if (numJugadores < 3) {
        alert('Se necesitan al menos 3 jugadores');
        return;
    }
    
    estadoJuego.numJugadores = numJugadores;
    estadoJuego.categoria = categoria;
    estadoJuego.jugadores = [];
    estadoJuego.puntuaciones = {};
    
    mostrarPantallaJugadores();
    crearInputsJugadores();
}

function mostrarPantallaJugadores() {
    ocultarTodasPantallas();
    pantallas.jugadores.classList.add('activa');
}

function crearInputsJugadores() {
    const lista = document.getElementById('lista-jugadores');
    lista.innerHTML = '';
    
    for (let i = 0; i < estadoJuego.numJugadores; i++) {
        const div = document.createElement('div');
        div.className = 'jugador-item';
        div.innerHTML = `
            <input type="text" 
                   id="jugador-${i}" 
                   placeholder="Jugador ${i + 1}" 
                   value="Jugador ${i + 1}">
        `;
        lista.appendChild(div);
    }
}

function continuarJuego() {
    // Recopilar nombres de jugadores
    estadoJuego.jugadores = [];
    for (let i = 0; i < estadoJuego.numJugadores; i++) {
        const input = document.getElementById(`jugador-${i}`);
        const nombre = input.value.trim() || `Jugador ${i + 1}`;
        estadoJuego.jugadores.push(nombre);
        estadoJuego.puntuaciones[nombre] = 0;
    }
    
    iniciarRonda();
}

function iniciarRonda() {
    // Seleccionar impostor aleatorio
    estadoJuego.impostor = Math.floor(Math.random() * estadoJuego.jugadores.length);
    
    // Obtener palabra secreta
    estadoJuego.palabraSecreta = obtenerPalabraAleatoria(estadoJuego.categoria);
    
    // Reiniciar estado de la ronda
    estadoJuego.pistas = [];
    estadoJuego.votos = {};
    estadoJuego.jugadorActual = 0;
    estadoJuego.modoVotacion = false;
    estadoJuego.modoAdivinanza = false;
    estadoJuego.modoAcusacion = false;
    
    mostrarPantallaJuego();
    actualizarVistaJuego();
}

function mostrarPantallaJuego() {
    ocultarTodasPantallas();
    pantallas.juego.classList.add('activa');
    
    // Actualizar información de la ronda
    document.getElementById('numero-ronda').textContent = estadoJuego.rondaActual;
    document.getElementById('categoria-actual').textContent = obtenerNombreCategoria(estadoJuego.categoria);
    
    // Mostrar jugador actual
    mostrarJugadorActual();
    
    // Actualizar puntuaciones
    actualizarPuntuaciones();
    
    // Reiniciar botones
    document.getElementById('btn-votar').style.display = 'none';
    document.getElementById('btn-adivinar').style.display = 'none';
    document.getElementById('btn-acusar').style.display = 'none';
}

function mostrarJugadorActual() {
    const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
    const esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
    
    // Crear o actualizar indicador de jugador actual
    let indicador = document.getElementById('indicador-jugador-actual');
    if (!indicador) {
        indicador = document.createElement('div');
        indicador.id = 'indicador-jugador-actual';
        indicador.style.cssText = 'text-align: center; padding: 15px; background: rgba(255,255,255,0.2); border-radius: 10px; margin-bottom: 20px; font-size: 1.2em; font-weight: bold;';
        document.querySelector('.contenido-juego').insertBefore(indicador, document.querySelector('.contenido-juego').firstChild);
    }
    
    indicador.innerHTML = `
        <div>Turno de: <span style="color: #4ade80;">${nombreJugador}</span></div>
        ${esImpostor ? '<div style="color: #f5576c; margin-top: 5px;">⚠️ Eres el IMPOSTOR</div>' : ''}
        <div style="font-size: 0.8em; margin-top: 10px; opacity: 0.8;">
            (Presiona → para cambiar de jugador)
        </div>
    `;
}

function actualizarVistaJuego() {
    const esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
    const vistaImpostor = document.getElementById('vista-impostor');
    const vistaNormal = document.getElementById('vista-normal');
    
    if (esImpostor) {
        vistaImpostor.style.display = 'block';
        vistaNormal.style.display = 'none';
    } else {
        vistaImpostor.style.display = 'none';
        vistaNormal.style.display = 'block';
        document.getElementById('palabra-secreta').textContent = estadoJuego.palabraSecreta;
    }
    
    // Actualizar lista de pistas
    actualizarListaPistas();
    
    // Habilitar/deshabilitar botones según el estado
    const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
    const yaEnvioPista = estadoJuego.pistas.some(p => p.jugador === nombreJugador);
    
    document.getElementById('btn-enviar-pista').disabled = yaEnvioPista;
    document.getElementById('input-pista').disabled = yaEnvioPista;
    
    if (yaEnvioPista) {
        document.getElementById('input-pista').placeholder = 'Ya enviaste tu pista';
    } else {
        document.getElementById('input-pista').placeholder = 'Escribe tu pista aquí...';
    }
    
    // Mostrar jugador actual
    mostrarJugadorActual();
    
    // Mostrar botones de acción si todos enviaron pistas
    if (estadoJuego.pistas.length === estadoJuego.jugadores.length) {
        document.getElementById('btn-votar').style.display = 'inline-block';
        if (esImpostor) {
            document.getElementById('btn-adivinar').style.display = 'inline-block';
        } else {
            document.getElementById('btn-adivinar').style.display = 'none';
        }
        document.getElementById('btn-acusar').style.display = 'inline-block';
    } else {
        document.getElementById('btn-votar').style.display = 'none';
        document.getElementById('btn-adivinar').style.display = 'none';
        document.getElementById('btn-acusar').style.display = 'none';
    }
}

function actualizarListaPistas() {
    const lista = document.getElementById('lista-pistas');
    lista.innerHTML = '';
    
    if (estadoJuego.pistas.length === 0) {
        lista.innerHTML = '<p style="text-align: center; opacity: 0.7;">Aún no hay pistas. Sé el primero en dar una pista.</p>';
        return;
    }
    
    estadoJuego.pistas.forEach(pista => {
        const div = document.createElement('div');
        div.className = 'pista-item';
        div.innerHTML = `
            <div class="pista-jugador">${pista.jugador}:</div>
            <div>${pista.texto}</div>
        `;
        lista.appendChild(div);
    });
}

function enviarPista() {
    const input = document.getElementById('input-pista');
    const texto = input.value.trim();
    
    if (!texto) {
        alert('Escribe una pista primero');
        return;
    }
    
    const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
    
    // Verificar si ya envió pista
    if (estadoJuego.pistas.some(p => p.jugador === nombreJugador)) {
        alert('Ya enviaste tu pista');
        return;
    }
    
    // Agregar pista
    estadoJuego.pistas.push({
        jugador: nombreJugador,
        texto: texto
    });
    
    input.value = '';
    actualizarListaPistas();
    actualizarVistaJuego();
    
    // Verificar si todos enviaron pistas
    if (estadoJuego.pistas.length === estadoJuego.jugadores.length) {
        document.getElementById('btn-votar').style.display = 'inline-block';
        const esImpostor = estadoJuego.jugadorActual === estadoJuego.impostor;
        if (esImpostor) {
            document.getElementById('btn-adivinar').style.display = 'inline-block';
        } else {
            document.getElementById('btn-adivinar').style.display = 'none';
        }
        document.getElementById('btn-acusar').style.display = 'inline-block';
    }
}

function iniciarVotacion() {
    estadoJuego.modoVotacion = true;
    estadoJuego.votos = {}; // Reiniciar votos
    ocultarTodasPantallas();
    pantallas.votacion.classList.add('activa');
    
    const lista = document.getElementById('lista-votos');
    lista.innerHTML = '';
    document.getElementById('resultados-votacion').innerHTML = '';
    
    // Mostrar instrucciones
    document.querySelector('.instruccion-votacion').textContent = 
        `Votación - Turno de: ${estadoJuego.jugadores[estadoJuego.jugadorActual]}`;
    
    estadoJuego.jugadores.forEach((jugador, index) => {
        if (jugador !== estadoJuego.jugadores[estadoJuego.jugadorActual]) {
            const div = document.createElement('div');
            div.className = 'voto-item';
            div.textContent = jugador;
            div.addEventListener('click', () => votarPorJugador(jugador, div));
            lista.appendChild(div);
        }
    });
    
    // Si todos votaron, mostrar resultados
    if (Object.keys(estadoJuego.votos).length === estadoJuego.jugadores.length - 1) {
        setTimeout(() => mostrarResultadosVotacion(), 1000);
    }
}

function votarPorJugador(jugadorVotado, elemento) {
    // Remover selección anterior
    document.querySelectorAll('.voto-item').forEach(item => {
        item.classList.remove('seleccionado');
    });
    
    // Marcar selección
    elemento.classList.add('seleccionado');
    
    const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
    estadoJuego.votos[nombreJugador] = jugadorVotado;
    
    // Cambiar al siguiente jugador para que vote
    const siguienteJugador = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
    
    // Si todos votaron, mostrar resultados
    if (Object.keys(estadoJuego.votos).length === estadoJuego.jugadores.length) {
        setTimeout(() => {
            mostrarResultadosVotacion();
        }, 1000);
    } else {
        // Continuar con el siguiente jugador
        estadoJuego.jugadorActual = siguienteJugador;
        setTimeout(() => {
            iniciarVotacion();
        }, 1500);
    }
}

function mostrarResultadosVotacion() {
    const resultados = document.getElementById('resultados-votacion');
    resultados.innerHTML = '<h3>Resultados de la Votación:</h3>';
    
    // Contar votos
    const conteoVotos = {};
    estadoJuego.jugadores.forEach(jugador => {
        conteoVotos[jugador] = 0;
    });
    
    Object.values(estadoJuego.votos).forEach(votado => {
        conteoVotos[votado] = (conteoVotos[votado] || 0) + 1;
    });
    
    // Mostrar conteo
    Object.entries(conteoVotos).forEach(([jugador, votos]) => {
        const div = document.createElement('div');
        div.className = 'resultado-voto';
        div.innerHTML = `<span>${jugador}</span><span>${votos} voto(s)</span>`;
        resultados.appendChild(div);
    });
    
    // Determinar ganador de la votación
    const maxVotos = Math.max(...Object.values(conteoVotos));
    const jugadoresVotados = Object.entries(conteoVotos)
        .filter(([_, votos]) => votos === maxVotos)
        .map(([jugador, _]) => jugador);
    
    setTimeout(() => {
        procesarResultadoVotacion(jugadoresVotados);
    }, 2000);
}

function procesarResultadoVotacion(jugadoresVotados) {
    const jugadorVotado = jugadoresVotados[0];
    const indiceVotado = estadoJuego.jugadores.indexOf(jugadorVotado);
    const esImpostor = indiceVotado === estadoJuego.impostor;
    
    let mensaje = '';
    let ganador = null;
    
    if (esImpostor) {
        // El impostor fue descubierto
        mensaje = `¡El impostor ${jugadorVotado} fue descubierto! 🎯`;
        mensaje += `<br>La palabra secreta era: <strong>${estadoJuego.palabraSecreta}</strong>`;
        
        // Todos los jugadores normales ganan puntos
        estadoJuego.jugadores.forEach((jugador, index) => {
            if (index !== estadoJuego.impostor) {
                estadoJuego.puntuaciones[jugador] += 10;
            }
        });
    } else {
        // Votaron a un inocente - el impostor gana
        mensaje = `¡Votaron a un inocente! 😈`;
        mensaje += `<br>El impostor era: <strong>${estadoJuego.jugadores[estadoJuego.impostor]}</strong>`;
        mensaje += `<br>La palabra secreta era: <strong>${estadoJuego.palabraSecreta}</strong>`;
        
        estadoJuego.puntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] += 15;
        ganador = estadoJuego.jugadores[estadoJuego.impostor];
    }
    
    mostrarResultados(mensaje, ganador);
}

function iniciarAdivinanza() {
    estadoJuego.modoAdivinanza = true;
    ocultarTodasPantallas();
    pantallas.adivinanza.classList.add('activa');
    
    document.getElementById('input-adivinanza').value = '';
    document.getElementById('input-adivinanza').focus();
}

function confirmarAdivinanza() {
    const input = document.getElementById('input-adivinanza');
    const adivinanza = input.value.trim().toLowerCase();
    const palabraCorrecta = estadoJuego.palabraSecreta.toLowerCase();
    
    let mensaje = '';
    let ganador = null;
    
    if (adivinanza === palabraCorrecta) {
        // El impostor adivinó correctamente
        mensaje = `¡El impostor ${estadoJuego.jugadores[estadoJuego.impostor]} adivinó la palabra! 🎯`;
        mensaje += `<br>La palabra era: <strong>${estadoJuego.palabraSecreta}</strong>`;
        estadoJuego.puntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] += 20;
        ganador = estadoJuego.jugadores[estadoJuego.impostor];
    } else {
        // El impostor falló
        mensaje = `¡El impostor falló al adivinar! ❌`;
        mensaje += `<br>La palabra secreta era: <strong>${estadoJuego.palabraSecreta}</strong>`;
        
        // Todos los jugadores normales ganan puntos
        estadoJuego.jugadores.forEach((jugador, index) => {
            if (index !== estadoJuego.impostor) {
                estadoJuego.puntuaciones[jugador] += 10;
            }
        });
    }
    
    mostrarResultados(mensaje, ganador);
}

function iniciarAcusacion() {
    estadoJuego.modoAcusacion = true;
    ocultarTodasPantallas();
    pantallas.acusacion.classList.add('activa');
    
    const lista = document.getElementById('lista-acusaciones');
    lista.innerHTML = '';
    
    const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
    
    estadoJuego.jugadores.forEach((jugador, index) => {
        if (jugador !== nombreJugador) {
            const div = document.createElement('div');
            div.className = 'acusacion-item';
            div.textContent = jugador;
            div.addEventListener('click', () => procesarAcusacion(jugador, index));
            lista.appendChild(div);
        }
    });
}

function procesarAcusacion(jugadorAcusado, indiceAcusado) {
    const esImpostor = indiceAcusado === estadoJuego.impostor;
    const nombreJugador = estadoJuego.jugadores[estadoJuego.jugadorActual];
    
    let mensaje = '';
    
    if (esImpostor) {
        mensaje = `¡${nombreJugador} acusó correctamente al impostor! 🎯`;
        mensaje += `<br>El impostor era: <strong>${jugadorAcusado}</strong>`;
        mensaje += `<br>La palabra secreta era: <strong>${estadoJuego.palabraSecreta}</strong>`;
        
        estadoJuego.puntuaciones[nombreJugador] += 15;
    } else {
        mensaje = `¡${nombreJugador} acusó a un inocente! 😈`;
        mensaje += `<br>El impostor era: <strong>${estadoJuego.jugadores[estadoJuego.impostor]}</strong>`;
        mensaje += `<br>La palabra secreta era: <strong>${estadoJuego.palabraSecreta}</strong>`;
        
        // El impostor gana puntos por confundir
        estadoJuego.puntuaciones[estadoJuego.jugadores[estadoJuego.impostor]] += 10;
    }
    
    mostrarResultados(mensaje, null);
}

function mostrarResultados(mensaje, ganador) {
    ocultarTodasPantallas();
    pantallas.resultados.classList.add('activa');
    
    document.getElementById('titulo-resultado').textContent = ganador 
        ? `¡${ganador} ganó esta ronda! 🏆` 
        : 'Ronda Finalizada';
    
    let contenido = mensaje;
    contenido += '<br><br><h3>Puntuaciones:</h3>';
    contenido += '<div style="text-align: left; max-width: 400px; margin: 0 auto;">';
    
    const puntuacionesOrdenadas = Object.entries(estadoJuego.puntuaciones)
        .sort((a, b) => b[1] - a[1]);
    
    puntuacionesOrdenadas.forEach(([jugador, puntos]) => {
        contenido += `<div style="display: flex; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.2); margin: 5px 0; border-radius: 5px;">
            <span>${jugador}</span>
            <span><strong>${puntos} puntos</strong></span>
        </div>`;
    });
    
    contenido += '</div>';
    
    document.getElementById('contenido-resultado').innerHTML = contenido;
}

function siguienteRonda() {
    estadoJuego.rondaActual++;
    iniciarRonda();
}

function nuevoJuego() {
    estadoJuego.rondaActual = 1;
    estadoJuego.puntuaciones = {};
    ocultarTodasPantallas();
    pantallas.inicio.classList.add('activa');
}

function cancelarAdivinanza() {
    estadoJuego.modoAdivinanza = false;
    mostrarPantallaJuego();
}

function cancelarAcusacion() {
    estadoJuego.modoAcusacion = false;
    mostrarPantallaJuego();
}

function volverInicio() {
    ocultarTodasPantallas();
    pantallas.inicio.classList.add('activa');
}

function ocultarTodasPantallas() {
    Object.values(pantallas).forEach(pantalla => {
        pantalla.classList.remove('activa');
    });
}

function actualizarPuntuaciones() {
    const contenedor = document.getElementById('puntuaciones');
    contenedor.innerHTML = '';
    
    Object.entries(estadoJuego.puntuaciones).forEach(([jugador, puntos]) => {
        const div = document.createElement('div');
        div.className = 'puntuacion-item';
        div.textContent = `${jugador}: ${puntos}`;
        contenedor.appendChild(div);
    });
}

// Permitir cambiar entre jugadores con las flechas del teclado
document.addEventListener('keydown', (e) => {
    if (pantallas.juego.classList.contains('activa') && !estadoJuego.modoVotacion && !estadoJuego.modoAdivinanza && !estadoJuego.modoAcusacion) {
        if (e.key === 'ArrowRight') {
            // Cambiar al siguiente jugador
            estadoJuego.jugadorActual = (estadoJuego.jugadorActual + 1) % estadoJuego.jugadores.length;
            actualizarVistaJuego();
        } else if (e.key === 'ArrowLeft') {
            // Cambiar al jugador anterior
            estadoJuego.jugadorActual = (estadoJuego.jugadorActual - 1 + estadoJuego.jugadores.length) % estadoJuego.jugadores.length;
            actualizarVistaJuego();
        }
    }
});

