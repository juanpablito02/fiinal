const tablero = document.getElementById("tablero");
const resultadoDado = document.getElementById("resultadoDado");
const turnoTexto = document.getElementById("turno");
const sonidoDado = document.getElementById("sonidoDado");
const modal = document.getElementById("modal");
const preguntaMatematica = document.getElementById("preguntaMatematica");
const respuestaInput = document.getElementById("respuesta");
const verificarBtn = document.getElementById("verificarRespuesta");
const dice = document.getElementById("dice-fade");
const sonidoVictoria = document.getElementById("sonidoVictoria");
const sonidoMovimiento = document.getElementById("sonidoMovimiento");
const colocarFicha = document.getElementById("colocarFicha");
const sonidoCorrecto = document.getElementById("sonidoCorrecto");
const sonidoIncorrecto = document.getElementById("sonidoIncorrecto");

// Recuperar datos del sessionStorage
const cantidadJugadores = parseInt(sessionStorage.getItem('cantidadJugadores') || '2');
const nombresJugadoresGuardados = JSON.parse(sessionStorage.getItem('nombresJugadores') || '[]');

// Variables para nombres de jugadores
let nombreJugador1 = nombresJugadoresGuardados[0] || "Jugador 1";
let nombreJugador2 = nombresJugadoresGuardados[1] || "Jugador 2";
let nombreJugador3 = nombresJugadoresGuardados[2] || "Jugador 3";
let nombreJugador4 = nombresJugadoresGuardados[3] || "Jugador 4";

// Array para almacenar todos los nombres de jugadores
const nombresJugadores = [nombreJugador1, nombreJugador2, nombreJugador3, nombreJugador4].slice(0, cantidadJugadores);

let posiciones = [];
let dadoGirado = false; // Variable para controlar que solo se gire una vez por 
let cambiandoTurno = false;

// Crear el tablero
function crearTablero() {
    const fragment = document.createDocumentFragment();
    for (let fila = 9; fila >= 0; fila--) {
        let esPar = fila % 2 === 0;
        for (let col = 0; col < 10; col++) {
            let numCasilla = esPar ? (fila * 10) + (col + 1) : (fila * 10) + (10 - col);
            
            let casilla = document.createElement("div");
            casilla.classList.add("casilla");
            casilla.setAttribute("id", `casilla-${numCasilla}`);
            casilla.setAttribute("data-numero", numCasilla);
            casilla.innerText = numCasilla;
            fragment.appendChild(casilla);
            posiciones[numCasilla] = casilla;
        }
    }
    tablero.appendChild(fragment);
}

// Reemplazar la creación directa del tablero con la función optimizada
crearTablero();

// Agregar esta función después de la función crearTablero()
function crearBarraNavegacion() {
    // Crear la barra de navegación
    const nav = document.createElement("nav");
    nav.id = "barra-navegacion";
    
    // Crear contenedor para el botón de reglas (izquierda)
    const contenedorIzquierdo = document.createElement("div");
    contenedorIzquierdo.className = "nav-izquierdo";
    
   // Crear contenedor para el título (centro)
    const contenedorCentral = document.createElement("div");
    contenedorCentral.className = "nav-central";
    
    // Crear contenedor para el botón de configuración (derecha)
    const contenedorDerecho = document.createElement("div");
    contenedorDerecho.className = "nav-derecho";
    
    // Botón de reglas
    const btnReglas = document.createElement("button");
    btnReglas.id = "btn-reglas";
    btnReglas.innerHTML = '<i class="fas fa-book"></i> Reglas';
    
    // Título del juego
    const tituloJuego = document.createElement("img");
    tituloJuego.id = "titulo-juego";
    tituloJuego.src = "/static/core/images/titulo-logo.png";
    tituloJuego.alt = "Escatica Logo";
    tituloJuego.style.width = "400px"; // Ajusta el ancho según tus necesidades
    tituloJuego.style.height = "80px"; // Mantiene la proporción original
    
    // Botón de configuraciones
    const btnConfig = document.createElement("button");
    btnConfig.id = "btn-config";
    btnConfig.innerHTML = '<i class="fas fa-cog"></i> Configuración';
    
    // Agregar elementos a sus contenedores
    contenedorIzquierdo.appendChild(btnReglas);
    contenedorCentral.appendChild(tituloJuego);
    contenedorDerecho.appendChild(btnConfig);
    
    // Agregar contenedores al nav
    nav.appendChild(contenedorIzquierdo);
    nav.appendChild(contenedorCentral);
    nav.appendChild(contenedorDerecho);
    
    // Insertar la barra en el contenedor principal, al principio
    const contenedor = document.querySelector(".contenedor-principal");
    contenedor.insertBefore(nav, contenedor.firstChild);
    
    // Agregar eventos a los botones
    btnReglas.addEventListener("click", mostrarReglasJuego);
    btnConfig.addEventListener("click", mostrarConfiguracion);
}

// Función para mostrar las reglas del juego
function mostrarReglasJuego() {
    // Crear modal para las reglas
    const modalReglas = document.createElement("div");
    modalReglas.className = "modal-reglas";
    modalReglas.style.position = "fixed";
    modalReglas.style.top = "0";
    modalReglas.style.left = "0";
    modalReglas.style.width = "100%";
    modalReglas.style.height = "100%";
    modalReglas.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modalReglas.style.display = "flex";
    modalReglas.style.justifyContent = "center";
    modalReglas.style.alignItems = "center";
    modalReglas.style.zIndex = "2000";
    
    const contenidoReglas = document.createElement("div");
    contenidoReglas.className = "modal-content";
    contenidoReglas.style.backgroundColor = "#fff";
    contenidoReglas.style.padding = "30px";
    contenidoReglas.style.borderRadius = "10px";
    contenidoReglas.style.maxWidth = "80%";
    contenidoReglas.style.maxHeight = "80vh";
    contenidoReglas.style.overflowY = "auto";
    
    contenidoReglas.innerHTML = `
        <h2 style="color: #4CAF50; text-align: center; margin-bottom: 20px;">Reglas del Juego Escatica</h2>
        
        <h3 style="color: #2196F3; margin-top: 15px;">Objetivo del Juego</h3>
        <p>El objetivo es ser el primer jugador en llegar a la casilla 100, respondiendo correctamente preguntas matemáticas en el camino.</p>
        
        <h3 style="color: #2196F3; margin-top: 15px;">Cómo Jugar</h3>
        <ol>
            <li>Los jugadores se turnan para lanzar el dado y mover sus fichas.</li>
            <li>Haz clic en el dado para lanzarlo y luego arrastra tu ficha a la casilla correspondiente.</li>
            <li>Si caes en una casilla especial, deberás responder una pregunta matemática.</li>
        </ol>
        
        <h3 style="color: #2196F3; margin-top: 15px;">Casillas Especiales</h3>
        <ul>
            <li><strong style="color: #4CAF50;">Escaleras:</strong> Si respondes correctamente, subes a una casilla superior.</li>
            <li><strong style="color: #F44336;">Serpientes:</strong> Si respondes incorrectamente, bajas a una casilla inferior.</li>
            <li><strong style="color: #FFC107;">Recompensa:</strong> Si respondes correctamente, ganas un turno extra.</li>
            <li><strong style="color: #F44336;">Trampa:</strong> Si respondes incorrectamente, retrocedes 3 casillas.</li>
            <li><strong style="color: #9C27B0;">Secreta:</strong> Si respondes correctamente, avanzas 2 casillas extra.</li>
        </ul>
        
        <h3 style="color: #2196F3; margin-top: 15px;">Fin del Juego</h3>
        <p>El juego termina cuando un jugador llega exactamente a la casilla 100. Si el número obtenido en el dado hace que sobrepases la casilla 100, pierdes el turno.</p>
        
        <div style="text-align: center; margin-top: 20px;">
            <button id="cerrar-reglas" style="background-color: #F44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">Cerrar</button>
        </div>
    `;
    
    modalReglas.appendChild(contenidoReglas);
    document.body.appendChild(modalReglas);
    
    // Configurar el botón de cerrar
    document.getElementById("cerrar-reglas").addEventListener("click", () => {
        document.body.removeChild(modalReglas);
    });
}

// Función para mostrar configuraciones
function mostrarConfiguracion() {
    // Crear modal para configuraciones
    const modalConfig = document.createElement("div");
    modalConfig.className = "modal-config";
    modalConfig.style.position = "fixed";
    modalConfig.style.top = "0";
    modalConfig.style.left = "0";
    modalConfig.style.width = "100%";
    modalConfig.style.height = "100%";
    modalConfig.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modalConfig.style.display = "flex";
    modalConfig.style.justifyContent = "center";
    modalConfig.style.alignItems = "center";
    modalConfig.style.zIndex = "2000";
    
    const contenidoConfig = document.createElement("div");
    contenidoConfig.style.backgroundColor = "#fff";
    contenidoConfig.style.padding = "30px";
    contenidoConfig.style.borderRadius = "10px";
    contenidoConfig.style.maxWidth = "80%";
    
    contenidoConfig.innerHTML = `
        <h2 style="color: #2196F3; text-align: center; margin-bottom: 20px;">Configuración</h2>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Control de Volumen</h3>
            <div style="display: flex; align-items: center; margin-top: 10px;">
                <label for="volumen-general" style="margin-right: 10px; min-width: 120px;">Volumen General:</label>
                <input type="range" id="volumen-general" min="0" max="1" step="0.1" value="1" style="flex-grow: 1;">
            </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 30px;">
            <button id="btn-reiniciar-config" style="background-color: #4CAF50; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 16px;">Reiniciar Juego</button>
            <button id="btn-menu-config" style="background-color: #2196F3; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 16px;">Volver al Menú</button>
            <button id="cerrar-config" style="background-color: #F44336; color: white; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 10px;">Cerrar</button>
        </div>
    `;
    
    modalConfig.appendChild(contenidoConfig);
    document.body.appendChild(modalConfig);
    
    // Configurar el control de volumen
    const volumenGeneral = document.getElementById("volumen-general");
    volumenGeneral.value = localStorage.getItem("volumenGeneral") || 1;
    
    volumenGeneral.addEventListener("input", () => {
        const volumen = parseFloat(volumenGeneral.value);
        localStorage.setItem("volumenGeneral", volumen);
        
        // Aplicar volumen a todos los elementos de audio
        const elementosAudio = [sonidoDado, sonidoVictoria, sonidoMovimiento, colocarFicha, sonidoCorrecto, sonidoIncorrecto];
        elementosAudio.forEach(audio => {
            if (audio) audio.volume = volumen;
        });
    });
    
    // Configurar botones
    document.getElementById("btn-reiniciar-config").addEventListener("click", () => {
        document.body.removeChild(modalConfig);
        reiniciarJuego();
    });
    
    document.getElementById("btn-menu-config").addEventListener("click", () => {
        window.location.href = "/menuUser/";
    });
    
    document.getElementById("cerrar-config").addEventListener("click", () => {
        document.body.removeChild(modalConfig);
    });
}

// Función para aplicar el volumen guardado al cargar la página
function aplicarVolumenGuardado() {
    const volumen = parseFloat(localStorage.getItem("volumenGeneral") || 1);
    const elementosAudio = [sonidoDado, sonidoVictoria, sonidoMovimiento, colocarFicha, sonidoCorrecto, sonidoIncorrecto];
    
    elementosAudio.forEach(audio => {
        if (audio) audio.volume = volumen;
    });
}

// Modificar la función de inicialización para incluir la barra de navegación
document.addEventListener("DOMContentLoaded", function() {
    // Agregar Font Awesome para los íconos
    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
    document.head.appendChild(fontAwesome);
    
    // Crear la barra de navegación
    crearBarraNavegacion();
    
    // Aplicar volumen guardado
    aplicarVolumenGuardado();
    
    // Mostrar mensaje de bienvenida
    mostrarMensajeBienvenida();
});

// Crear fichas de jugadores
const crearFicha = (id, color) => {
    let ficha = document.createElement("div");
    ficha.classList.add("ficha");
    ficha.setAttribute("id", id);
    ficha.setAttribute("draggable", "true");
    ficha.style.backgroundColor = color;
    
    ficha.addEventListener("mouseenter", () => {
        if (colocarFicha) {
            colocarFicha.currentTime = 0;
            colocarFicha.play();
        }
    });
    
    return ficha;
};

// Colores para los jugadores
const coloresJugadores = ["blue", "red", "green", "purple"];

// Array para almacenar las fichas de los jugadores
let fichasJugadores = [];
let posicionesJugadores = Array(cantidadJugadores).fill(1); // Inicializar con 1 para todos los jugadores

// Mostrar mensaje de bienvenida con todos los jugadores
function mostrarMensajeBienvenida() {
    let mensaje = "¡Bienvenidos a Escatica! ";
    
    if (cantidadJugadores > 1) {
        const nombresFormateados = nombresJugadores.map((nombre, index) => {
            if (index === nombresJugadores.length - 1) {
                return `y ${nombre}`;
            } else if (index === nombresJugadores.length - 2) {
                return nombre;
            } else {
                return `${nombre},`;
            }
        }).join(' ');
        
        mensaje += `Jugadores: ${nombresFormateados}.`;
    } else {
        mensaje += `Jugador: ${nombresJugadores[0]}.`;
    }
    
    mostrarMensaje(mensaje);
}

// Llamar a esta función al inicio del juego
document.addEventListener("DOMContentLoaded", function() {
    mostrarMensajeBienvenida();
});

// Crear fichas según la cantidad de jugadores
for (let i = 0; i < cantidadJugadores; i++) {
    let ficha = crearFicha(`jugador${i+1}`, coloresJugadores[i]);
    fichasJugadores.push(ficha);
}

// Colocar fichas en el tablero
fichasJugadores.forEach(ficha => {
    posiciones[1].appendChild(ficha);
});

// Mantener compatibilidad con código existente
let jugador1 = fichasJugadores[0];
let jugador2 = fichasJugadores[1];
let posJugador1 = 1, posJugador2 = 1;

let turno = 1, pasosPermitidos = 0, fichaSeleccionada = null;

const elementos = [
    { tipo: "serpiente", inicio: 98, fin: 78, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 95, fin: 75, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 92, fin: 53, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 83, fin: 22, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 73, fin: 12, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 64, fin: 36, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 62, fin: 37, img: "serpiente.png" },
    { tipo: "serpiente", inicio: 49, fin: 11, img: "serpiente.png" },
    
    // Escaleras - distribuidas en diferentes zonas del tablero
    { tipo: "escalera", inicio: 4, fin: 25, img: "escalera.png" },
    { tipo: "escalera", inicio: 8, fin: 31, img: "escalera.png" },
    { tipo: "escalera", inicio: 21, fin: 42, img: "escalera.png" },
    { tipo: "escalera", inicio: 28, fin: 74, img: "escalera.png" },
    { tipo: "escalera", inicio: 36, fin: 57, img: "escalera.png" },
    { tipo: "escalera", inicio: 42, fin: 63, img: "escalera.png" },
    { tipo: "escalera", inicio: 51, fin: 67, img: "escalera.png" },
    { tipo: "escalera", inicio: 71, fin: 91, img: "escalera.png" },
    
    // Casillas de Recompensa - distribuidas en el tablero
    { tipo: "recompensa", inicio: 7, fin: null, img: "estrella.png" },
    { tipo: "recompensa", inicio: 19, fin: null, img: "estrella.png" },
    { tipo: "recompensa", inicio: 33, fin: null, img: "cofre.png" },
    { tipo: "recompensa", inicio: 52, fin: null, img: "estrella.png" },
    { tipo: "recompensa", inicio: 68, fin: null, img: "cofre.png" },
    { tipo: "recompensa", inicio: 85, fin: null, img: "estrella.png" },
    
    // Casillas de Trampa - distribuidas en el tablero
    { tipo: "trampa", inicio: 15, fin: null, img: "advertencia.png" },
    { tipo: "trampa", inicio: 29, fin: null, img: "advertencia.png" },
    { tipo: "trampa", inicio: 47, fin: null, img: "advertencia.png" },
    { tipo: "trampa", inicio: 59, fin: null, img: "advertencia.png" },
    { tipo: "trampa", inicio: 76, fin: null, img: "advertencia.png" },
    { tipo: "trampa", inicio: 93, fin: null, img: "advertencia.png" },
    
    // Casillas Secretas - sin imagen visible
    { tipo: "secreta", inicio: 6, fin: null, img: null },
    { tipo: "secreta", inicio: 13, fin: null, img: null },
    { tipo: "secreta", inicio: 24, fin: null, img: null },
    { tipo: "secreta", inicio: 38, fin: null, img: null },
    { tipo: "secreta", inicio: 45, fin: null, img: null },
    { tipo: "secreta", inicio: 56, fin: null, img: null },
    { tipo: "secreta", inicio: 69, fin: null, img: null },
    { tipo: "secreta", inicio: 77, fin: null, img: null },
    { tipo: "secreta", inicio: 84, fin: null, img: null },
    { tipo: "secreta", inicio: 97, fin: null, img: null }
];

let escaleras = {}, serpientes = {}, recompensas = {}, trampas = {}, secretas = {};

elementos.forEach(({ tipo, inicio, fin, img }) => {
    if (img) {
        let imgElement = document.createElement("img");
        imgElement.src = img;
        imgElement.classList.add(tipo);
        posiciones[inicio].appendChild(imgElement);
    }

    if (tipo === "escalera") escaleras[inicio] = fin;
    else if (tipo === "serpiente") serpientes[inicio] = fin;
    else if (tipo === "recompensa") recompensas[inicio] = true;
    else if (tipo === "trampa") trampas[inicio] = true;
    else if (tipo === "secreta") secretas[inicio] = true;
});

// Evento del dado (versión única y corregida)
dice.addEventListener("click", () => {
    // Verificar si ya se giró el dado en este turno
    if (dadoGirado) {
        mostrarMensaje(`¡${nombresJugadores[turno-1]} ya has girado el dado! Debes mover tu ficha.`);
        return;
    }
    
    // Primero, limpiar TODOS los resaltados previos
    document.querySelectorAll(".casilla").forEach(c => {
        c.classList.remove("casilla-correcta");
        c.classList.remove("casilla-pulsante");
    });
    
    // Animación y sonido del dado
    if (sonidoDado) sonidoDado.play();
    dice.classList.add('fade');
    
    setTimeout(() => {
        // Generar número aleatorio entre 1 y 6
        const resultado = Math.floor(Math.random() * 6) + 1;
        resultadoDado.innerText = resultado;
        pasosPermitidos = resultado;
        
        // Mostrar los puntos correspondientes al resultado
        renderFace('dice-fade', resultado);
        dice.classList.remove('fade');
        
        // Marcar que el dado ya fue girado
        dadoGirado = true;
        
        // Calcular nueva posición usando el array posicionesJugadores
        let nuevaPos = posicionesJugadores[turno - 1] + pasosPermitidos;
        
        if (nuevaPos > 100) {
            mostrarMensaje(`¡Los movimientos superan el límite! ${nombresJugadores[turno-1]} pierde el turno.`, true);
            // Limpiar cualquier resaltado para evitar movimientos no deseados
            limpiarResaltados();
            // Desactivar el dado girado para evitar arrastres no deseados
            dadoGirado = false;
            setTimeout(() => cambiarTurno(), 1500);
            return;
        }
        
        // Resaltar SOLO la casilla correcta para el jugador activo
        posiciones[nuevaPos].classList.add("casilla-correcta");
        posiciones[nuevaPos].classList.add("casilla-pulsante");
        
        mostrarMensaje(`¡${nombresJugadores[turno-1]}, mueve tu ficha ${pasosPermitidos} casillas!`);
    }, 600);
});


// Eventos de drag and drop
document.addEventListener("dragstart", (event) => {
    if (!dadoGirado) {
        mostrarMensaje("Primero debes girar el dado antes de mover tu ficha.");
        event.preventDefault();
        return;
    }
    
    // Verificar si es el turno del jugador que intenta mover la ficha
    const jugadorId = event.target.id;
    const jugadorNumero = parseInt(jugadorId.replace('jugador', ''));
    
    if (jugadorNumero === turno) {
        fichaSeleccionada = event.target;
        event.dataTransfer.setData("text/plain", fichaSeleccionada.id);
        event.dataTransfer.effectAllowed = "move";
        
        // Añadir clase visual para indicar que la ficha está siendo arrastrada
        fichaSeleccionada.classList.add("arrastrando");
    } else {
        // No es el turno de este jugador
        mostrarMensaje(`¡No es tu turno! Ahora juega ${nombresJugadores[turno - 1]}.`);
        event.preventDefault();
    }
});

// Función para limpiar resaltados
function limpiarResaltados() {
    document.querySelectorAll(".casilla").forEach(casilla => {
        casilla.classList.remove("casilla-correcta");
        casilla.classList.remove("casilla-pulsante");
        casilla.classList.remove("hover-valido");
    });
}

document.addEventListener("dragend", (event) => {
    if (fichaSeleccionada) {
        fichaSeleccionada.classList.remove("arrastrando");
    }
    // Limpiar TODOS los resaltados al finalizar el arrastre
    limpiarResaltados();
});

// Configurar eventos para las casillas
document.querySelectorAll(".casilla").forEach(casilla => {
    casilla.addEventListener("dragover", (event) => {
        // Obtener la nueva posición basada en el turno actual
        let nuevaPos = posicionesJugadores[turno - 1] + pasosPermitidos;
        
        // Verificar si esta es la casilla correcta
        if (parseInt(casilla.dataset.numero) === nuevaPos) {
            event.preventDefault(); // Permitir el drop
            casilla.classList.add("hover-valido");
        }
    });

    casilla.addEventListener("dragleave", () => {
        casilla.classList.remove("hover-valido");
    });

    casilla.addEventListener("drop", (event) => {
        casilla.classList.remove("hover-valido");
        return handleDrop(event, casilla);
    });
});

// Función para agregar estilos de animación para la ficha activa
function agregarEstilosAnimacionFicha() {
    if (!document.getElementById('estilos-ficha-activa')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-ficha-activa';
        estilos.textContent = `
            @keyframes pulso {
                0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
                }
                50% {
                    transform: scale(1.1);
                    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.7);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
                }
            }
            
            .ficha-activa {
                animation: pulso 1.5s infinite;
                z-index: 10;
            }
        `;
        document.head.appendChild(estilos);
    }
}

// Función para actualizar la ficha activa según el turno actual
function actualizarFichaActiva() {
    // Primero, quitar la clase de todas las fichas
    document.querySelectorAll('.ficha').forEach(ficha => {
        ficha.classList.remove('ficha-activa');
    });
    
    // Luego, añadir la clase solo a la ficha del jugador actual
    const fichaActual = document.getElementById(`jugador${turno}`);
    if (fichaActual) {
        fichaActual.classList.add('ficha-activa');
    }
}

// Inicializar el juego
turnoTexto.innerText = nombreJugador1;
// Agregar los estilos para la animación de la ficha activa
agregarEstilosAnimacionFicha();
// Establecer la ficha activa inicial
actualizarFichaActiva();
mostrarMensaje(`¡Juego iniciado! Turno de ${nombreJugador1}`);

// Función para mostrar mensajes
function mostrarMensaje(mensaje, esAlerta = false) {
    if (esAlerta) {
        alert(mensaje);
        return;
    }
    
    // Crear o actualizar elemento para mostrar mensajes
    let mensajeElement = document.getElementById("mensaje-juego");
    if (!mensajeElement) {
        mensajeElement = document.createElement("div");
        mensajeElement.id = "mensaje-juego";
        mensajeElement.style.position = "fixed";
        mensajeElement.style.bottom = "20px";
        mensajeElement.style.left = "50%";
        mensajeElement.style.transform = "translateX(-50%)";
        mensajeElement.style.backgroundColor = "#333";
        mensajeElement.style.color = "white";
        mensajeElement.style.padding = "10px 20px";
        mensajeElement.style.borderRadius = "5px";
        mensajeElement.style.zIndex = "1000";
        mensajeElement.style.transition = "opacity 0.3s";
        document.body.appendChild(mensajeElement);
    }
    
    mensajeElement.textContent = mensaje;
    mensajeElement.style.opacity = "1";
    
    // Ocultar el mensaje después de 3 segundos
    clearTimeout(window.mensajeTimeout);
    window.mensajeTimeout = setTimeout(() => {
        mensajeElement.style.opacity = "0";
    }, 3000);
}

function mostrarMensajeFelicitaciones(nombreJugador) {
    // Agregar estilos para el confeti
    agregarEstilosConfeti();
    
    // Lanzar confeti
    crearConfeti();
    
    // Crear un modal de victoria
    const modalVictoria = document.createElement("div");
    modalVictoria.className = "modal-victoria";
    modalVictoria.style.position = "fixed";
    modalVictoria.style.top = "0";
    modalVictoria.style.left = "0";
    modalVictoria.style.width = "100%";
    modalVictoria.style.height = "100%";
    modalVictoria.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modalVictoria.style.display = "flex";
    modalVictoria.style.justifyContent = "center";
    modalVictoria.style.alignItems = "center";
    modalVictoria.style.zIndex = "2000";
    
    const contenidoVictoria = document.createElement("div");
    contenidoVictoria.style.backgroundColor = "#fff";
    contenidoVictoria.style.padding = "30px";
    contenidoVictoria.style.borderRadius = "10px";
    contenidoVictoria.style.textAlign = "center";
    contenidoVictoria.style.maxWidth = "80%";
    
    contenidoVictoria.innerHTML = `
        <h2 style="color: #4CAF50; font-size: 28px; margin-bottom: 20px;">🎉 ¡FELICIDADES! 🎉</h2>
        <p style="font-size: 24px; margin-bottom: 20px; color: #4CAF50;"><strong>${nombreJugador}</strong> ha ganado el juego</p>
        <p style="font-size: 18px; margin-bottom: 30px;">¡Has demostrado tus habilidades matemáticas y estratégicas!</p>
        <div style="display: flex; justify-content: space-around; margin-top: 20px;">
            <button id="btn-menu" style="background-color: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">Volver al Menú</button>
            <button id="btn-reiniciar" style="background-color: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px;">Jugar de nuevo</button>
        </div>
        <button id="btn-clasificacion" style="background-color: #FF9800; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-top: 20px; width: 100%;">Ver Clasificación</button>
    `;
    
    modalVictoria.appendChild(contenidoVictoria);
    document.body.appendChild(modalVictoria);
    
    // Reproducir sonido de victoria
    if (sonidoVictoria) {
        sonidoVictoria.currentTime = 0;
        sonidoVictoria.play();
    }
    
    // Configurar el botón de reiniciar
    document.getElementById("btn-reiniciar").addEventListener("click", () => {
        document.body.removeChild(modalVictoria);
        reiniciarJuego();
    });
    
    // Configurar el botón de volver al menú
    document.getElementById("btn-menu").addEventListener("click", () => {
        window.location.href = "/menuUser/";
    });
    
    // Configurar el botón de ver clasificación
    document.getElementById("btn-clasificacion").addEventListener("click", () => {
        document.body.removeChild(modalVictoria);
        mostrarClasificaciones();
    });
}

// Función para mover ficha
function moverFicha(posicionActual, nuevaPosicion) {
    // Obtener la ficha del jugador actual
    const ficha = fichasJugadores[turno - 1];
    
    // Actualizar la posición en el array
    posicionesJugadores[turno - 1] = nuevaPosicion;
    
    // Mantener compatibilidad con código existente
    if (turno === 1) posJugador1 = nuevaPosicion;
    if (turno === 2) posJugador2 = nuevaPosicion;
    
    // Mover la ficha a la nueva posición
    posiciones[nuevaPosicion].appendChild(ficha);
    
    // Reproducir sonido de movimiento
    if (sonidoMovimiento) {
        sonidoMovimiento.currentTime = 0;
        sonidoMovimiento.play();
    }
    
    // Verificar si hay escalera, serpiente o casilla especial en la nueva posición
    // Solo verificamos si no venimos de una casilla especial (para evitar bucles)
    if (!recompensas[posicionActual] && !trampas[posicionActual] && !secretas[posicionActual]) {
        if (escaleras[nuevaPosicion]) {
            // Mostrar operación matemática para escalera
            mostrarOperacionMatematica(nuevaPosicion, "escalera");
        } else if (serpientes[nuevaPosicion]) {
            // Mostrar operación matemática para serpiente
            mostrarOperacionMatematica(nuevaPosicion, "serpiente");
        } else if (recompensas[nuevaPosicion]) {
            // Mostrar operación matemática para recompensa
            mostrarOperacionEspecial(nuevaPosicion, "recompensa");
        } else if (trampas[nuevaPosicion]) {
            // Mostrar operación matemática para trampa
            mostrarOperacionEspecial(nuevaPosicion, "trampa");
        } else if (secretas[nuevaPosicion]) {
            // Mostrar operación matemática para casilla secreta
            mostrarOperacionEspecial(nuevaPosicion, "secreta");
        } else {
            // Si no hay elementos especiales, cambiar turno directamente
            setTimeout(() => cambiarTurno(), 2000);
        }
    } else {
        // Si venimos de una casilla especial, cambiar turno directamente
        setTimeout(() => cambiarTurno(), 2000);
    }
    
    // Verificar victoria
    if (nuevaPosicion === 100) {
        // Guardar el nombre del jugador ganador antes de cambiar el turno
        const nombreGanador = nombresJugadores[turno - 1];
        
        // Mostrar mensaje de victoria con el nombre correcto
        setTimeout(() => {
            mostrarMensajeFelicitaciones(nombreGanador);
        }, 2000);
        
        // No cambiamos el turno si hay victoria
        return;
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Resetear posiciones
    posicionesJugadores = Array(cantidadJugadores).fill(1);
    posJugador1 = 1;
    posJugador2 = 1;
    
    // Mover fichas a la posición inicial
    fichasJugadores.forEach(ficha => {
        if (ficha.parentNode) ficha.parentNode.removeChild(ficha);
        posiciones[1].appendChild(ficha);
    });
    
    // Resetear turno y dado
    turno = 1;
    dadoGirado = false;
    pasosPermitidos = 0;
    
    // Actualizar interfaz
    turnoTexto.innerText = nombresJugadores[0];
    resultadoDado.innerText = "0";
    renderFace('dice-fade', 1);
    
    // Limpiar cualquier resaltado de casilla
    document.querySelectorAll(".casilla").forEach(casilla => 
        casilla.classList.remove("casilla-correcta"));
    
    // Actualizar la ficha activa
    actualizarFichaActiva();
        
    mostrarMensaje(`¡Juego reiniciado! Turno de ${nombresJugadores[0]}`);
}

// Función para cambiar turno
function cambiarTurno() {
    // Si ya hay un cambio de turno en proceso, salir de la función
    if (cambiandoTurno) {
        console.log("Cambio de turno en proceso, ignorando llamada adicional");
        return;
    }
    
    // Activar el bloqueo
    cambiandoTurno = true;
    
    // Resetear el estado del dado
    dadoGirado = false;
    pasosPermitidos = 0;
    fichaSeleccionada = null;
    
    // Limpiar resaltados
    limpiarResaltados();
    
    // Cambiar al siguiente turno
    turno = (turno % cantidadJugadores) + 1;
    
    // Actualizar el texto del turno con el nombre del jugador actual
    turnoTexto.innerText = nombresJugadores[turno - 1];
    
    // Actualizar la ficha activa
    actualizarFichaActiva();
    
    // Mostrar mensaje de cambio de turno
    mostrarMensaje(`Turno de ${nombresJugadores[turno - 1]}`);
    
    // Liberar el bloqueo después de un breve retraso para asegurar que todas las animaciones terminen
    setTimeout(() => {
        cambiandoTurno = false;
    }, 1000);
}

// Función para generar operaciones matemáticas
function generarOperacionMatematica() {
    // Generar números aleatorios para la operación
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    // Elegir operación aleatoria (suma, resta, multiplicación)
    const operaciones = ['+', '-', '*'];
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
    
    // Calcular la respuesta correcta
    let respuestaCorrecta;
    let pregunta;
    
    switch(operacion) {
        case '+':
            respuestaCorrecta = num1 + num2;
            pregunta = `${num1} + ${num2} = ?`;
            break;
        case '-':
            // Asegurar que la resta no dé resultado negativo
            if (num1 < num2) {
                respuestaCorrecta = num2 - num1;
                pregunta = `${num2} - ${num1} = ?`;
            } else {
                respuestaCorrecta = num1 - num2;
                pregunta = `${num1} - ${num2} = ?`;
            }
            break;
        case '*':
            respuestaCorrecta = num1 * num2;
            pregunta = `${num1} × ${num2} = ?`;
            break;
    }
    
    // Generar opciones (incluyendo la respuesta correcta)
    const opciones = [respuestaCorrecta];
    
    // Generar 3 opciones incorrectas
    while (opciones.length < 4) {
        // Generar una opción incorrecta cercana a la respuesta correcta
        let opcionIncorrecta;
        if (respuestaCorrecta < 10) {
            opcionIncorrecta = Math.floor(Math.random() * 20) + 1;
        } else {
            opcionIncorrecta = respuestaCorrecta + Math.floor(Math.random() * 21) - 10;
        }
        
        // Asegurar que la opción sea positiva y no esté repetida
        if (opcionIncorrecta > 0 && !opciones.includes(opcionIncorrecta)) {
            opciones.push(opcionIncorrecta);
        }
    }
    
    // Mezclar las opciones
    for (let i = opciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opciones[i], opciones[j]] = [opciones[j], opciones[i]];
    }
    
    return {
        pregunta,
        opciones,
        respuestaCorrecta
    };
}

function generarOperacionFacil() {
    const operaciones = [
        // Sumas sencillas
        () => {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            return {
                pregunta: `${num1} + ${num2} = ?`,
                respuesta: num1 + num2
            };
        },
        // Restas sencillas (resultado positivo)
        () => {
            const num2 = Math.floor(Math.random() * 5) + 1;
            const num1 = Math.floor(Math.random() * 5) + 5 + num2;
            return {
                pregunta: `${num1} - ${num2} = ?`,
                respuesta: num1 - num2
            };
        }
    ];
    
    const operacionAleatoria = operaciones[Math.floor(Math.random() * operaciones.length)];
    return operacionAleatoria();
}

function generarOperacionMedia() {
    const operaciones = [
        // Multiplicaciones de una cifra
        () => {
            const num1 = Math.floor(Math.random() * 9) + 2;
            const num2 = Math.floor(Math.random() * 9) + 2;
            return {
                pregunta: `${num1} × ${num2} = ?`,
                respuesta: num1 * num2
            };
        },
        // Sumas de dos cifras
        () => {
            const num1 = Math.floor(Math.random() * 40) + 10;
            const num2 = Math.floor(Math.random() * 40) + 10;
            return {
                pregunta: `${num1} + ${num2} = ?`,
                respuesta: num1 + num2
            };
        },
        // Restas de dos cifras (resultado positivo)
        () => {
            const num2 = Math.floor(Math.random() * 20) + 10;
            const num1 = Math.floor(Math.random() * 30) + 30;
            return {
                pregunta: `${num1} - ${num2} = ?`,
                respuesta: num1 - num2
            };
        },
        // Problemas sencillos de lógica
        () => {
            const problemas = [
                {
                    pregunta: "Si tengo 3 manzanas y compro 2 docenas más. ¿Cuántas manzanas tengo en total?",
                    respuesta: 27
                },
                {
                    pregunta: "Un tren tiene 8 vagones con 12 asientos cada uno. ¿Cuántos asientos hay en total?",
                    respuesta: 96
                },
                {
                    pregunta: "Si reparto 45 caramelos entre 9 niños por igual, ¿cuántos caramelos recibe cada niño?",
                    respuesta: 5
                },
                {
                    pregunta: "Tengo 24 lápices y quiero guardarlos en cajas de 6 lápices cada una. ¿Cuántas cajas necesito?",
                    respuesta: 4
                }
            ];
            return problemas[Math.floor(Math.random() * problemas.length)];
        }
    ];
    
    const operacionAleatoria = operaciones[Math.floor(Math.random() * operaciones.length)];
    return operacionAleatoria();
}

// Función para manejar el evento drop
function handleDrop(event, casilla) {
    event.preventDefault();
    
    // Si no hay pasos permitidos, no permitir el movimiento
    if (pasosPermitidos === 0) {
        mostrarMensaje("No puedes mover tu ficha en este momento.");
        return;
    }
    
    // Obtener la nueva posición basada en el turno actual
    let nuevaPos = posicionesJugadores[turno - 1] + pasosPermitidos;
    let numCasilla = parseInt(casilla.dataset.numero);
    
    // Verificar que sea la casilla correcta
    if (numCasilla === nuevaPos) {
        // Mover la ficha
        casilla.appendChild(fichaSeleccionada);
        
        // Actualizar posición del jugador
        posicionesJugadores[turno - 1] = numCasilla;
        
        // Mantener compatibilidad con código existente
        if (turno === 1) posJugador1 = numCasilla;
        if (turno === 2) posJugador2 = numCasilla;
        
        // Reproducir sonido de movimiento
        if (sonidoMovimiento) {
            sonidoMovimiento.currentTime = 0;
            sonidoMovimiento.play();
        }
        
        // Verificar si hay escalera, serpiente o casilla especial
        if (escaleras[numCasilla]) {
            // Mostrar operación matemática para escalera
            mostrarOperacionMatematica(numCasilla, "escalera");
        } else if (serpientes[numCasilla]) {
            // Mostrar operación matemática para serpiente
            mostrarOperacionMatematica(numCasilla, "serpiente");
        } else if (recompensas[numCasilla]) {
            // Mostrar operación matemática para recompensa
            mostrarOperacionEspecial(numCasilla, "recompensa");
        } else if (trampas[numCasilla]) {
            // Mostrar operación matemática para trampa
            mostrarOperacionEspecial(numCasilla, "trampa");
        } else if (secretas[numCasilla]) {
            // Mostrar operación matemática para casilla secreta
            mostrarOperacionEspecial(numCasilla, "secreta");
        } else {
            // No hay escalera, serpiente ni casilla especial, cambiar turno
            setTimeout(() => cambiarTurno(), 1000);
        }
        
        // Verificar victoria
        if (posicionesJugadores[turno - 1] === 100 || (escaleras[nuevaPos] && escaleras[nuevaPos] === 100)) {
            // Guardar el nombre del jugador ganador antes de cambiar el turno
            const nombreGanador = nombresJugadores[turno - 1];
            
            // Mostrar mensaje de victoria con el nombre correcto
            setTimeout(() => {
                mostrarMensajeFelicitaciones(nombreGanador);
            }, 2000);
            
            // Cambiar turno después de mostrar el mensaje
            setTimeout(() => {
                cambiarTurno();
            }, 2500);
            
            return true;
        }
    } else {
        mostrarMensaje("¡Solo puedes mover a la casilla resaltada!");
    }
}

// Variables para el temporizador
let tiempoRestante = 0;
let temporizadorInterval = null;
let barraProgreso = null;

// Función para mostrar operaciones matemáticas
function mostrarOperacionMatematica(casilla) {
    // Generar operación matemática aleatoria
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operaciones = ['+', '-', '*'];
    const operacion = operaciones[Math.floor(Math.random() * operaciones.length)];
    
    let resultado;
    let pregunta;
    
    switch(operacion) {
        case '+':
            resultado = num1 + num2;
            pregunta = `${num1} + ${num2} = ?`;
            break;
        case '-':
            // Asegurar que el resultado sea positivo
            if (num1 < num2) {
                resultado = num2 - num1;
                pregunta = `${num2} - ${num1} = ?`;
            } else {
                resultado = num1 - num2;
                pregunta = `${num1} - ${num2} = ?`;
            }
            break;
        case '*':
            resultado = num1 * num2;
            pregunta = `${num1} × ${num2} = ?`;
            break;
    }
    
    // Generar opciones (una correcta y tres incorrectas)
    let opciones = [resultado];
    while (opciones.length < 4) {
        const opcionIncorrecta = Math.floor(Math.random() * 20) + 1;
        if (!opciones.includes(opcionIncorrecta)) {
            opciones.push(opcionIncorrecta);
        }
    }
    
    // Mezclar opciones
    opciones = opciones.sort(() => Math.random() - 0.5);
    
    // Determinar si estamos en una escalera o serpiente
    const esEscalera = escaleras[casilla] !== undefined;
    const esSerpiente = serpientes[casilla] !== undefined;
    
    // Actualizar el contenido del modal
    preguntaMatematica.innerHTML = `
        <div class="temporizador-container">
            <span id="tiempo-restante">30</span>
            <div class="temporizador">
                <div class="barra-tiempo" id="barra-tiempo"></div>
            </div>
        </div>
        <h3>${esEscalera ? '¡Has caído en una escalera!' : '¡Has caído en una serpiente!'}</h3>
        <p>Resuelve correctamente para ${esEscalera ? 'subir' : 'evitar bajar'}:</p>
        <div class="operacion-matematica">${pregunta}</div>
        <div class="opciones-container" id="opciones-container"></div>
    `;
    
    // Obtener referencia a la barra de progreso
    barraProgreso = document.getElementById('barra-tiempo');
    
    // Crear botones de opciones
    const opcionesContainer = document.getElementById('opciones-container');
    opcionesContainer.innerHTML = '';
    
    opciones.forEach(opcion => {
        const boton = document.createElement('button');
        boton.className = 'opcion-btn';
        boton.textContent = opcion;
        boton.onclick = () => verificarRespuesta(opcion, resultado, casilla);
        opcionesContainer.appendChild(boton);
    });
    
    // Mostrar modal
    modal.style.display = 'flex';
    
    // Iniciar temporizador (30 segundos)
    tiempoRestante = 30;
    document.getElementById('tiempo-restante').textContent = tiempoRestante;
    barraProgreso.style.width = '100%';
    
    // Limpiar intervalo anterior si existe
    if (temporizadorInterval) {
        clearInterval(temporizadorInterval);
        temporizadorInterval = null;
    }
    
    // Crear nuevo intervalo
    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo-restante').textContent = tiempoRestante;
        barraProgreso.style.width = `${(tiempoRestante / 30) * 100}%`;
        
        // Cambiar color de la barra según el tiempo restante
        if (tiempoRestante <= 5) {
            barraProgreso.style.backgroundColor = '#ff6b6b';
        } else if (tiempoRestante <= 10) {
            barraProgreso.style.backgroundColor = '#ffd166';
        }
        
        // Si el tiempo llega a cero, cerrar modal y marcar como incorrecto
        if (tiempoRestante <= 0) {
            clearInterval(temporizadorInterval);
            temporizadorInterval = null;
            
            // Reproducir sonido de incorrecto
            if (sonidoIncorrecto) {
                sonidoIncorrecto.currentTime = 0;
                sonidoIncorrecto.play();
            }
            
            // Cerrar modal
            modal.style.display = 'none';
            
            // Determinar si es serpiente o escalera y aplicar consecuencia
            if (escaleras[casilla]) {
                mostrarMensaje(`¡Tiempo agotado! ${turno === 1 ? nombreJugador1 : nombreJugador2} se queda en la misma posición y pierde el turno.`);
                setTimeout(() => cambiarTurno(), 3000);
            } else if (serpientes[casilla]) {
                const nuevaPosicion = serpientes[casilla];
                mostrarMensaje(`¡Tiempo agotado! ${turno === 1 ? nombreJugador1 : nombreJugador2} desciende a la casilla ${nuevaPosicion}.`);
                
                // Mover la ficha a la nueva posición
                setTimeout(() => {
                    if (turno === 1) {
                        posiciones[nuevaPosicion].appendChild(jugador1);
                        posJugador1 = nuevaPosicion;
                    } else {
                        posiciones[nuevaPosicion].appendChild(jugador2);
                        posJugador2 = nuevaPosicion;
                    }
                    
                    // Cambiar turno después de mover
                    setTimeout(() => cambiarTurno(), 2000);
                }, 2000);
            }
        }
    }, 2000);
}

function mostrarOperacionEspecial(casilla, tipo) {
    // Determinar el tipo de operación según la casilla
    let operacion;
    let titulo;
    let descripcion;
    let consecuenciaPositiva;
    let consecuenciaNegativa;
    
    if (tipo === "recompensa") {
        operacion = generarOperacionMedia();
        titulo = "¡Casilla de Recompensa! 🌟";
        descripcion = "Resuelve correctamente para avanzar 2 casillas o ganar una medalla:";
        consecuenciaPositiva = "avanzar 2 casillas o ganar una medalla";
        consecuenciaNegativa = "quedarte en la misma posición";
    } else if (tipo === "trampa") {
        operacion = generarOperacionFacil();
        titulo = "¡Casilla de Trampa! ⚠️";
        descripcion = "Resuelve correctamente para evitar retroceder:";
        consecuenciaPositiva = "evitar la trampa";
        consecuenciaNegativa = "retroceder 1 casilla o perder el turno";
    } else if (tipo === "secreta") {
        // Para casillas secretas, elegimos aleatoriamente entre operación fácil y media
        operacion = Math.random() < 0.5 ? generarOperacionFacil() : generarOperacionMedia();
        titulo = "¡Casilla Secreta! 🔮";
        descripcion = "Esta casilla esconde un desafío. Resuelve:";
        consecuenciaPositiva = "recibir una sorpresa positiva";
        consecuenciaNegativa = "enfrentar una consecuencia";
    }
    
    // Actualizar el contenido del modal
    preguntaMatematica.innerHTML = `
        <div class="temporizador-container">
            <span id="tiempo-restante">30</span>
            <div class="temporizador">
                <div class="barra-tiempo" id="barra-tiempo"></div>
            </div>
        </div>
        <h3>${titulo}</h3>
        <p>${descripcion}</p>
        <div class="operacion-matematica">${operacion.pregunta}</div>
        <div class="opciones-container" id="opciones-container"></div>
    `;
    
    // Obtener referencia a la barra de progreso
    barraProgreso = document.getElementById('barra-tiempo');
    
    // Generar opciones (una correcta y tres incorrectas)
    let opciones = [operacion.respuesta];
    while (opciones.length < 4) {
        // Generar opciones incorrectas cercanas a la respuesta correcta
        let opcionIncorrecta;
        if (typeof operacion.respuesta === 'number') {
            // Para respuestas numéricas, generar valores cercanos
            const rango = Math.max(10, Math.abs(operacion.respuesta));
            opcionIncorrecta = operacion.respuesta + Math.floor(Math.random() * rango * 2) - rango;
            // Asegurarse de que la opción incorrecta sea diferente y positiva (si corresponde)
            if (opcionIncorrecta === operacion.respuesta || opcionIncorrecta < 0) {
                opcionIncorrecta = operacion.respuesta + 1 + Math.floor(Math.random() * 5);
            }
        } else {
            // Para respuestas no numéricas (por si acaso)
            opcionIncorrecta = Math.floor(Math.random() * 100);
        }
        
        if (!opciones.includes(opcionIncorrecta)) {
            opciones.push(opcionIncorrecta);
        }
    }
    
    // Mezclar opciones
    opciones = opciones.sort(() => Math.random() - 0.5);
    
    // Crear botones de opciones
    const opcionesContainer = document.getElementById('opciones-container');
    opcionesContainer.innerHTML = '';
    
    opciones.forEach(opcion => {
        const boton = document.createElement('button');
        boton.className = 'opcion-btn';
        boton.textContent = opcion;
        boton.onclick = () => verificarRespuestaEspecial(opcion, operacion.respuesta, casilla, tipo);
        opcionesContainer.appendChild(boton);
    });
    
    // Mostrar modal
    modal.style.display = 'flex';
    
    // Iniciar temporizador (30 segundos)
    tiempoRestante = 30;
    document.getElementById('tiempo-restante').textContent = tiempoRestante;
    barraProgreso.style.width = '100%';
    
    // Limpiar intervalo anterior si existe
    if (temporizadorInterval) clearInterval(temporizadorInterval);
    
    // Crear nuevo intervalo
    temporizadorInterval = setInterval(() => {
        tiempoRestante--;
        document.getElementById('tiempo-restante').textContent = tiempoRestante;
        barraProgreso.style.width = `${(tiempoRestante / 30) * 100}%`;
        
        // Cambiar color de la barra según el tiempo restante
        if (tiempoRestante <= 5) {
            barraProgreso.style.backgroundColor = '#ff6b6b';
        } else if (tiempoRestante <= 10) {
            barraProgreso.style.backgroundColor = '#ffd166';
        }
        
        // Si el tiempo llega a cero, cerrar modal y aplicar consecuencia negativa
        if (tiempoRestante <= 0) {
            clearInterval(temporizadorInterval);
            
            // Reproducir sonido de incorrecto
            if (sonidoIncorrecto) {
                sonidoIncorrecto.currentTime = 0;
                sonidoIncorrecto.play();
            }
            
            // Cerrar modal
            modal.style.display = 'none';
            
            // Aplicar consecuencia según el tipo de casilla
            aplicarConsecuenciaNegativa(casilla, tipo);
        }
    }, 2000);
}

// Función para inicializar datos de la partida
function inicializarDatosPartida() {
    // Intentar obtener datos de sessionStorage
    const datosPartidaJSON = sessionStorage.getItem('datosPartida');
    
    if (datosPartidaJSON) {
        try {
            const datosPartida = JSON.parse(datosPartidaJSON);
            
            // Verificar si hay apodos disponibles
            if (datosPartida.apodos && datosPartida.apodos.length >= 2) {
                nombreJugador1 = datosPartida.apodos[0];
                nombreJugador2 = datosPartida.apodos[1];
                
                // Actualizar el texto del turno
                turnoTexto.innerText = nombreJugador1;
            }
        } catch (error) {
            console.error("Error al parsear datos de partida:", error);
        }
    }
}

// Inicializar el juego con nombres personalizados
window.onload = () => {
    // Inicializar datos de la partida
    inicializarDatosPartida();
    
    // Si no hay datos en sessionStorage, solicitar nombres
    if (nombreJugador1 === "Jugador 1" && nombreJugador2 === "Jugador 2") {
        nombreJugador1 = prompt("Ingresa el nombre del Jugador 1:", "Jugador 1") || "Jugador 1";
        nombreJugador2 = prompt("Ingresa el nombre del Jugador 2:", "Jugador 2") || "Jugador 2";
    }
    
    renderFace('dice-fade', 1);
    turnoTexto.innerText = nombreJugador1;
    
};


// Mejora 2: Función mejorada para mostrar mensajes con tiempo de duración automático
function mostrarMensaje(texto, esError = false, duracion = 3000) {
    const mensajeElement = document.getElementById("mensaje-juego") || crearElementoMensaje();
    mensajeElement.textContent = texto;
    mensajeElement.style.backgroundColor = esError ? "#f44336" : "#4CAF50";
    mensajeElement.style.opacity = "1";
    
    // Limpiar cualquier temporizador existente
    if (window.mensajeTimeout) {
        clearTimeout(window.mensajeTimeout);
    }
    
    // Configurar desaparición automática
    window.mensajeTimeout = setTimeout(() => {
        mensajeElement.style.opacity = "0";
    }, duracion);
    
    return mensajeElement;
}

// Función auxiliar para crear el elemento de mensaje si no existe
function crearElementoMensaje() {
    const mensajeElement = document.createElement("div");
    mensajeElement.id = "mensaje-juego";
    document.body.appendChild(mensajeElement);
    return mensajeElement;
}






// Función para manejar cuando se agota el tiempo
function tiempoAgotado(nuevaPos, respuestaCorrecta) {
    // Determinar si estamos en una escalera o serpiente
    const esEscalera = escaleras[nuevaPos] !== undefined;
    const esSerpiente = serpientes[nuevaPos] !== undefined;
    
    // Resaltar la respuesta correcta
    document.querySelectorAll('.opcion-btn').forEach(btn => {
        const valor = parseInt(btn.dataset.valor);
        
        if (valor === respuestaCorrecta) {
            btn.style.backgroundColor = "#4CAF50";
            btn.style.color = "white";
        }
        
        // Deshabilitar todos los botones
        btn.disabled = true;
    });
    
    // Reproducir sonido de incorrecto
    if (sonidoIncorrecto) sonidoIncorrecto.play();
    
    // Mostrar mensaje según el caso
    let mensaje = "";
    if (esEscalera) {
        mensaje = "¡Tiempo agotado! Te quedas en la casilla actual.";
    } else if (esSerpiente) {
        mensaje = `¡Tiempo agotado! Bajarás por la serpiente a la casilla ${serpientes[nuevaPos]}.`;
    } else {
        mensaje = "¡Tiempo agotado! Pierdes el turno.";
    }
    
    mostrarMensaje(mensaje);
    
    // Esperar un momento para que el jugador vea el resultado
    setTimeout(() => {
        // Cerrar el modal
        modal.style.display = "none";
        
        // Aplicar efecto según el caso
        if (esSerpiente) {
            // Si se agota el tiempo en una serpiente, baja
            moverFicha(nuevaPos, serpientes[nuevaPos]);
        }
        // Si se agota el tiempo en una escalera, se queda (no hacer nada)
        
        // Cambiar turno después de aplicar los efectos
        setTimeout(() => cambiarTurno(), 1000);
    }, 2500);
}

// Función para verificar respuesta
function verificarRespuesta(respuestaUsuario, respuestaCorrecta, casilla) {
    // Detener el temporizador
    clearInterval(temporizadorInterval);
    
    // Determinar si estamos en una escalera o serpiente
    const esEscalera = escaleras[casilla] !== undefined;
    const esSerpiente = serpientes[casilla] !== undefined;
    
    // Verificar si la respuesta es correcta
    const esCorrecta = respuestaUsuario === respuestaCorrecta;
    
    // Mostrar mensaje según el resultado
    if (esCorrecta) {
        // Reproducir sonido de respuesta correcta
        if (sonidoCorrecto) {
            sonidoCorrecto.currentTime = 0;
            sonidoCorrecto.play();
        }
        
        // Cerrar el modal
        modal.style.display = 'none';
        
        if (esEscalera) {
            // Subir por la escalera
            const nuevaPos = escaleras[casilla];
            mostrarMensaje(`¡Respuesta correcta! ${nombresJugadores[turno-1]} sube por la escalera a la casilla ${nuevaPos}.`);
            
            // Animar el movimiento (con un pequeño retraso para que se vea el mensaje)
            setTimeout(() => {
                moverFicha(casilla, nuevaPos);
                // No llamamos a cambiarTurno() aquí, ya que moverFicha() lo hará
            }, 2000);
        } else if (esSerpiente) {
            // No bajar por la serpiente (respuesta correcta)
            mostrarMensaje(`¡Respuesta correcta! ${nombresJugadores[turno-1]} evita bajar por la serpiente.`);
            
            // Cambiar turno después de un breve retraso
            setTimeout(() => cambiarTurno(), 2500);
        }
    } else {
        // Reproducir sonido de respuesta incorrecta
        if (sonidoIncorrecto) {
            sonidoIncorrecto.currentTime = 0;
            sonidoIncorrecto.play();
        }
        
        // Cerrar el modal
        modal.style.display = 'none';
        
        if (esEscalera) {
            // No subir por la escalera (respuesta incorrecta)
            mostrarMensaje(`¡Respuesta incorrecta! ${nombresJugadores[turno-1]} no puede subir por la escalera.`);
            
            // Cambiar turno después de un breve retraso
            setTimeout(() => cambiarTurno(), 2500);
        } else if (esSerpiente) {
            // Bajar por la serpiente
            const nuevaPos = serpientes[casilla];
            mostrarMensaje(`¡Respuesta incorrecta! ${nombresJugadores[turno-1]} baja por la serpiente a la casilla ${nuevaPos}.`);
            
            // Animar el movimiento (con un pequeño retraso para que se vea el mensaje)
            setTimeout(() => {
                moverFicha(casilla, nuevaPos);
                
                // Cambiar turno después de un breve retraso
                setTimeout(() => cambiarTurno(), 2000);
            }, 2000);
        }
    }
}

function verificarRespuestaEspecial(respuestaUsuario, respuestaCorrecta, casilla, tipo) {
    // Detener el temporizador
    clearInterval(temporizadorInterval);
    
    // Verificar si la respuesta es correcta
    const esCorrecta = respuestaUsuario === respuestaCorrecta;
    
    // Cerrar el modal
    modal.style.display = 'none';
    
    if (esCorrecta) {
        // Reproducir sonido de respuesta correcta
        if (sonidoCorrecto) {
            sonidoCorrecto.currentTime = 0;
            sonidoCorrecto.play();
        }
        
        // Aplicar consecuencia positiva según el tipo de casilla
        aplicarConsecuenciaPositiva(casilla, tipo);
    } else {
        // Reproducir sonido de respuesta incorrecta
        if (sonidoIncorrecto) {
            sonidoIncorrecto.currentTime = 0;
            sonidoIncorrecto.play();
        }
        
        // Aplicar consecuencia negativa según el tipo de casilla
        aplicarConsecuenciaNegativa(casilla, tipo);
    }
}

function aplicarConsecuenciaPositiva(casilla, tipo) {
    if (tipo === "recompensa") {
        // Decidir aleatoriamente entre avanzar 2 casillas o ganar una medalla
        const decision = Math.random() < 0.5;
        
        if (decision && posicionesJugadores[turno - 1] + 2 <= 100) {
            // Avanzar 2 casillas
            const nuevaPos = posicionesJugadores[turno - 1] + 2;
            mostrarMensaje(`¡Respuesta correcta! ${nombresJugadores[turno-1]} avanza 2 casillas adicionales.`);
            
            // Animar el movimiento
            setTimeout(() => {
                moverFicha(posicionesJugadores[turno - 1], nuevaPos);
                
                // Cambiar turno después de un breve retraso
                setTimeout(() => cambiarTurno(), 2000);
            }, 2000);
        } else {
            // Ganar una medalla
            mostrarMensaje(`¡Respuesta correcta! ${nombresJugadores[turno-1]} ha ganado una medalla.`);
            
            // Aquí podrías implementar la lógica para guardar la medalla en la base de datos
            // Por ahora, solo mostramos un mensaje y cambiamos el turno
            setTimeout(() => cambiarTurno(), 2500);
        }
    } else if (tipo === "trampa") {
        // Evitar la trampa
        mostrarMensaje(`¡Respuesta correcta! ${nombresJugadores[turno-1]} evita la trampa.`);
        
        // Cambiar turno después de un breve retraso
        setTimeout(() => cambiarTurno(), 2500);
    } else if (tipo === "secreta") {
        // Decidir aleatoriamente entre diferentes recompensas
        const recompensas = [
            // Avanzar 1 casilla
            () => {
                if (posicionesJugadores[turno - 1] + 1 <= 100) {
                    const nuevaPos = posicionesJugadores[turno - 1] + 1;
                    mostrarMensaje(`¡Sorpresa positiva! ${nombresJugadores[turno-1]} avanza 1 casilla.`);
                    
                    // Animar el movimiento
                    setTimeout(() => {
                        moverFicha(posicionesJugadores[turno - 1], nuevaPos);
                        
                        // Cambiar turno después de un breve retraso
                        setTimeout(() => cambiarTurno(), 2000);
                    }, 2000);
                } else {
                    mostrarMensaje(`¡Sorpresa positiva! ${nombresJugadores[turno-1]} gana puntos extra.`);
                    setTimeout(() => cambiarTurno(), 2500);
                }
            },
            // Ganar puntos extra
            () => {
                mostrarMensaje(`¡Sorpresa positiva! ${nombresJugadores[turno-1]} gana puntos extra.`);
                setTimeout(() => cambiarTurno(), 2500);
            },
            // Tirar el dado otra vez
            () => {
                mostrarMensaje(`¡Sorpresa positiva! ${nombresJugadores[turno-1]} puede tirar el dado otra vez.`);
                
                // Resetear el estado del dado para permitir otro lanzamiento
                dadoGirado = false;
                pasosPermitidos = 0;
                
                // No cambiar el turno
            }
        ];
        
        // Elegir una recompensa aleatoria
        const recompensaAleatoria = recompensas[Math.floor(Math.random() * recompensas.length)];
        recompensaAleatoria();
    }
}

function aplicarConsecuenciaNegativa(casilla, tipo) {
    if (tipo === "recompensa") {
        // No hay consecuencia negativa, solo se pierde la recompensa
        mostrarMensaje(`${nombresJugadores[turno-1]} no ha conseguido la recompensa.`);
        
        // Cambiar turno después de un breve retraso
        setTimeout(() => cambiarTurno(), 2500);
    } else if (tipo === "trampa") {
        // Decidir aleatoriamente entre retroceder 1 casilla o perder el turno
        const decision = Math.random() < 0.5;
        
        if (decision && posicionesJugadores[turno - 1] > 1) {
            // Retroceder 1 casilla
            const nuevaPos = posicionesJugadores[turno - 1] - 1;
            mostrarMensaje(`¡Has caído en la trampa! ${nombresJugadores[turno-1]} retrocede 1 casilla.`);
            
            // Animar el movimiento
            setTimeout(() => {
                moverFicha(posicionesJugadores[turno - 1], nuevaPos);
                
                // Cambiar turno después de un breve retraso
                setTimeout(() => cambiarTurno(), 2000);
            }, 1000);
        } else {
            // Perder el turno
            mostrarMensaje(`¡Has caído en la trampa! ${nombresJugadores[turno-1]} pierde el turno.`);
            
            // Cambiar turno después de un breve retraso
            setTimeout(() => cambiarTurno(), 2500);
        }
    } else if (tipo === "secreta") {
        // Decidir aleatoriamente entre diferentes consecuencias
        const consecuencias = [
            // Retroceder 1 casilla
            () => {
                if (posicionesJugadores[turno - 1] > 1) {
                    const nuevaPos = posicionesJugadores[turno - 1] - 1;
                    mostrarMensaje(`¡Consecuencia negativa! ${nombresJugadores[turno-1]} retrocede 1 casilla.`);
                    
                    // Animar el movimiento
                    setTimeout(() => {
                        moverFicha(posicionesJugadores[turno - 1], nuevaPos);
                        
                        // Cambiar turno después de un breve retraso
                        setTimeout(() => cambiarTurno(), 2000);
                    }, 2000);
                } else {
                    mostrarMensaje(`¡Consecuencia negativa! ${nombresJugadores[turno-1]} pierde el turno.`);
                    setTimeout(() => cambiarTurno(), 2500);
                }
            },
            // Perder el turno
            () => {
                mostrarMensaje(`¡Consecuencia negativa! ${nombresJugadores[turno-1]} pierde el turno.`);
                setTimeout(() => cambiarTurno(), 2500);
            }
        ];
        
        // Elegir una consecuencia aleatoria
        const consecuenciaAleatoria = consecuencias[Math.floor(Math.random() * consecuencias.length)];
        consecuenciaAleatoria();
    }
}

// Función para crear el efecto de confeti
function crearConfeti() {
    const contenedor = document.createElement('div');
    contenedor.style.position = 'fixed';
    contenedor.style.top = '0';
    contenedor.style.left = '0';
    contenedor.style.width = '100%';
    contenedor.style.height = '100%';
    contenedor.style.pointerEvents = 'none';
    contenedor.style.zIndex = '1999';
    document.body.appendChild(contenedor);
    
    // Colores para el confeti
    const colores = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500', '#800080'];
    
    // Crear 150 piezas de confeti
    for (let i = 0; i < 150; i++) {
        const confeti = document.createElement('div');
        confeti.style.position = 'absolute';
        confeti.style.width = `${Math.random() * 10 + 5}px`;
        confeti.style.height = `${Math.random() * 5 + 5}px`;
        confeti.style.backgroundColor = colores[Math.floor(Math.random() * colores.length)];
        confeti.style.top = '-10px';
        confeti.style.left = `${Math.random() * 100}%`;
        confeti.style.borderRadius = '50%';
        confeti.style.opacity = Math.random() + 0.5;
        
        // Animación de caída
        const duracion = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        confeti.style.animation = `caida ${duracion}s ease-in ${delay}s forwards`;
        
        contenedor.appendChild(confeti);
        
        // Eliminar el confeti después de la animación
        setTimeout(() => {
            if (confeti.parentNode === contenedor) {
                contenedor.removeChild(confeti);
            }
            
            // Eliminar el contenedor cuando no queden confetis
            if (contenedor.childNodes.length === 0) {
                document.body.removeChild(contenedor);
            }
        }, (duracion + delay) * 2000);
    }
}

// Añadir la animación CSS para el confeti
function agregarEstilosConfeti() {
    if (!document.getElementById('estilos-confeti')) {
        const estilos = document.createElement('style');
        estilos.id = 'estilos-confeti';
        estilos.textContent = `
            @keyframes caida {
                0% {
                    transform: translateY(0) rotate(0deg);
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;
        document.head.appendChild(estilos);
    }
}

// Permitir usar Enter en el modal
respuestaInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        verificarBtn.click();
    }
});

function renderFace(diceId, face) {
    const dice = document.getElementById(diceId);
    dice.innerHTML = '';
    const dots = {
        1: [4],
        2: [0, 8],
        3: [0, 4, 8],
        4: [0, 2, 6, 8],
        5: [0, 2, 4, 6, 8],
        6: [0, 2, 3, 5, 6, 8]
    };

    dots[face].forEach(i => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dice.appendChild(dot);
        const row = Math.floor(i / 3);
        const col = i % 3;
        dot.style.gridRow = row + 1;
        dot.style.gridColumn = col + 1;
    });
}

// Función para inicializar datos de la partida
function inicializarDatosPartida() {
    // Intentar obtener datos de sessionStorage
    const datosPartidaJSON = sessionStorage.getItem('datosPartida');
    
    if (datosPartidaJSON) {
        try {
            const datosPartida = JSON.parse(datosPartidaJSON);
            
            // Verificar si hay apodos disponibles
            if (datosPartida.apodos && datosPartida.apodos.length >= 2) {
                nombreJugador1 = datosPartida.apodos[0];
                nombreJugador2 = datosPartida.apodos[1];
                
                // Actualizar el texto del turno
                turnoTexto.innerText = nombreJugador1;
            }
        } catch (error) {
            console.error("Error al parsear datos de partida:", error);
        }
    }
}

// Inicializar el juego con nombres personalizados
window.onload = () => {
    // Inicializar datos de la partida
    inicializarDatosPartida();
    
    // Si no hay datos en sessionStorage, solicitar nombres
    if (nombreJugador1 === "Jugador 1" && nombreJugador2 === "Jugador 2") {
        nombreJugador1 = prompt("Ingresa el nombre del Jugador 1:", "Jugador 1") || "Jugador 1";
        nombreJugador2 = prompt("Ingresa el nombre del Jugador 2:", "Jugador 2") || "Jugador 2";
    }
    
    renderFace('dice-fade', 1);
    turnoTexto.innerText = nombreJugador1;
    mostrarMensaje(`¡Bienvenidos ${nombreJugador1} y ${nombreJugador2}! Comienza ${nombreJugador1}.`);
    
    // Añadir botón de reinicio
    const panelElement = document.querySelector(".panel");
    if (panelElement && !document.getElementById("reiniciar-btn")) {
        const reiniciarBtn = document.createElement("button");
        reiniciarBtn.id = "reiniciar-btn";
        reiniciarBtn.textContent = "Reiniciar Juego";
        reiniciarBtn.addEventListener("click", reiniciarJuego);
        panelElement.appendChild(reiniciarBtn);
    }
};

function mostrarClasificaciones() {
    // Crear un array con los datos de los jugadores
    let clasificacion = [];
    for (let i = 0; i < cantidadJugadores; i++) {
        clasificacion.push({
            nombre: nombresJugadores[i],
            posicion: posicionesJugadores[i],
            color: coloresJugadores[i]
        });
    }
    
    // Ordenar por posición (de mayor a menor)
    clasificacion.sort((a, b) => b.posicion - a.posicion);
    
    // Crear el modal
    const modalClasificacion = document.createElement("div");
    modalClasificacion.className = "modal-clasificacion";
    modalClasificacion.style.position = "fixed";
    modalClasificacion.style.top = "0";
    modalClasificacion.style.left = "0";
    modalClasificacion.style.width = "100%";
    modalClasificacion.style.height = "100%";
    modalClasificacion.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modalClasificacion.style.display = "flex";
    modalClasificacion.style.justifyContent = "center";
    modalClasificacion.style.alignItems = "center";
    modalClasificacion.style.zIndex = "2000";
    
    const contenidoClasificacion = document.createElement("div");
    contenidoClasificacion.style.backgroundColor = "#fff";
    contenidoClasificacion.style.padding = "30px";
    contenidoClasificacion.style.borderRadius = "10px";
    contenidoClasificacion.style.textAlign = "center";
    contenidoClasificacion.style.maxWidth = "80%";
    contenidoClasificacion.style.minWidth = "300px";
    
    // Crear el contenido HTML
    let contenidoHTML = `
        <h2 style="color: #4CAF50; font-size: 28px; margin-bottom: 20px;">🏆 Clasificación Final 🏆</h2>
        <div style="margin-bottom: 30px;">
    `;
    
    // Añadir cada jugador a la clasificación
    clasificacion.forEach((jugador, index) => {
        const medalla = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "🎮";
        const estilo = index === 0 ? "font-weight: bold; font-size: 20px;" : "font-size: 18px;";
        
        contenidoHTML += `
            <div style="display: flex; align-items: center; margin-bottom: 15px; ${estilo}">
                <span style="margin-right: 10px; font-size: 24px;">${medalla}</span>
                <span style="flex-grow: 1; text-align: left;">${jugador.nombre}</span>
                <span style="background-color: ${jugador.color}; width: 20px; height: 20px; border-radius: 50%; display: inline-block; margin-right: 10px;"></span>
                <span>Casilla ${jugador.posicion}</span>
            </div>
        `;
    });
    
    contenidoHTML += `
        </div>
        <div style="display: flex; justify-content: space-around; margin-top: 20px;">
            <button id="btn-menu-clasificacion" style="background-color: #2196F3; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin-right: 10px;">Volver al Menú</button>
            <button id="btn-reiniciar-clasificacion" style="background-color: #4CAF50; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px;">Jugar de nuevo</button>
        </div>
    `;
    
    contenidoClasificacion.innerHTML = contenidoHTML;
    modalClasificacion.appendChild(contenidoClasificacion);
    document.body.appendChild(modalClasificacion);
    
    // Configurar botones
    document.getElementById("btn-reiniciar-clasificacion").addEventListener("click", () => {
        document.body.removeChild(modalClasificacion);
        reiniciarJuego();
    });
    
    document.getElementById("btn-menu-clasificacion").addEventListener("click", () => {
        window.location.href = "/menuUser/";
    });
}
