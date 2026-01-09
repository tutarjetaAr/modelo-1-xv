// ==========================================
// 1. ESCUCHA DE MENSAJES (LANDING PAGE)
// ==========================================
window.addEventListener("message", (event) => {
    // Seguridad: Puedes validar event.origin si quieres ser estricto
    
    // Verificamos si es un mensaje de cambio de plan
    if (event.data && event.data.tipo === 'cambioPlan') {
        const nuevoPlan = event.data.plan;
        console.log("Modo Demo activado: " + nuevoPlan);
        
        // Cambiamos el atributo en el body
        // Esto dispara las reglas CSS que agregamos al final de estilo1.css
        document.body.setAttribute('data-plan', nuevoPlan);

        // Opcional: Si el plan es Estándar (que no tiene música), pausamos el audio si suena
        if (nuevoPlan === 'estandar') {
            const audio = document.getElementById('musica');
            if(audio && !audio.paused) {
                audio.pause();
                // Resetear icono botón flotante si existe
                // ... lógica de tu botón flotante ...
            }
        }
    }
});


// LOGICA DEL BOTON FLOTANTE DE MUSICA
const portada = document.getElementById('primera-p'); 
const btnIngresar = document.getElementById('boton-ingresar'); 
const contenidoPrincipal = document.getElementById('contenido-principal'); 
const contenedorMusica = document.getElementById('contenedor-musica-flotante'); 

// Audio
const audio = document.getElementById('musica');
const btnFloat = document.getElementById('boton-play-flotante');
const icono = btnFloat.querySelector('i');

// --- EVENTO: AL HACER CLIC EN "INGRESAR" ---
btnIngresar.addEventListener('click', () => {
    // 1. Reproducir música (Aprovechamos el clic)
    audio.play();

    // 2. Desvanecer tu portada
    portada.classList.add('desvanecer-portada');

    // 3. Mostrar el contenido principal y el botón de música
    // Esperamos un poquito (0.5s) para que sea suave
    setTimeout(() => {
        portada.style.display = 'none'; // La quitamos del todo
        contenidoPrincipal.style.display = 'block'; // Mostramos la invitación
        contenedorMusica.style.display = 'block'; // Mostramos el botón flotante
    }, 800);
    
    // 4. Activar animación del botón flotante
    btnFloat.classList.add('animacion-reproduccion');
});

// --- CONTROL DEL BOTÓN FLOTANTE ---
btnFloat.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        icono.classList.remove('fa-play');
        icono.classList.add('fa-pause');
        btnFloat.classList.add('animacion-reproduccion');
    } else {
        audio.pause();
        icono.classList.remove('fa-pause');
        icono.classList.add('fa-play');
        btnFloat.classList.remove('animacion-reproduccion');
    }
});


// --- PERSONALIZACIÓN URL ---
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const invitado = params.get('invitado');
    const cantidad = params.get('pases');
    if (invitado) {
        document.getElementById('nombre-invitado-dinamico').textContent = invitado.replace(/-/g, ' '); 
        document.getElementById('bienvenida-premium').style.display = 'block';
    }
    if (cantidad) {
        document.getElementById('escribir').textContent = cantidad.replace(/-/g, ' '); 
        document.getElementById('mensaje-cantidad').style.display = 'block';
    }
    
    const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
    window.history.replaceState({ path: cleanUrl }, '', cleanUrl);

});



// LOGICA DE LA CUENTA REGRESIVA 
// Año, Mes (0-11), Día, Hora, Minutos, Segundos
const fechaEvento = new Date(2026, 2, 20, 0, 1, 0).getTime(); 

// 2. Referencias al DOM
const elDias = document.getElementById('dias');
const elHoras = document.getElementById('horas');
const elMinutos = document.getElementById('minutos');
const elSegundos = document.getElementById('segundos');
const contenedorLiDias = document.getElementById('li-dias'); 
const mensajeContador = document.getElementById('mensaje-contador'); 

const actualizarContador = setInterval(() => {
    const ahora = new Date().getTime();
    const distancia = fechaEvento - ahora;

    // Cálculos matemáticos
    const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
    const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

    // --- CASO 1: YA PASÓ EL EVENTO ---
    if (distancia < 0) {
        clearInterval(actualizarContador); // Detenemos el intervalo
        
        // Dejamos todo en cero fijo
        elDias.innerText = "00";
        elHoras.innerText = "00";
        elMinutos.innerText = "00";
        elSegundos.innerText = "00";
        
        // Si quieres que el mensaje de "Es hoy" desaparezca cuando termine:
        mensajeContador.classList.remove('visible');

        return; 
    }

    // --- CASO 2: ES HOY (Menos de 1 día) ---
    if (dias === 0) {
        // Ocultamos el contador de días
        contenedorLiDias.style.display = 'none';
        
        // Inyectamos HTML: Solo el SPAN tiene la clase de animación
        mensajeContador.innerHTML = '<span class="texto-latido">¡ES HOY!</span> Faltan solo:';
        mensajeContador.classList.add('visible');
    } else {
        // --- CASO 3: NORMAL ---
        contenedorLiDias.style.display = 'flex'; 
        mensajeContador.classList.remove('visible');
    }

    // Actualizamos los números mientras no sea menor a 0
    elDias.innerText = dias < 10 ? '0' + dias : dias;
    elHoras.innerText = horas < 10 ? '0' + horas : horas;
    elMinutos.innerText = minutos < 10 ? '0' + minutos : minutos;
    elSegundos.innerText = segundos < 10 ? '0' + segundos : segundos;

}, 1000);



// --- LOGICA BOTON AGENDAR ---
// 1° configuro datos
const datosEvento = {
  titulo: "XV Vale y Martu",
  descripcion: "¡Te esperamos para compartir esta noche mágica!",
  ubicacion: "Canzonieri Park, Av. Aconquija 3450",
  // formato YYYYMMDDTHHmmss
  inicio: "20260320T210000", 
  fin:    "20260321T050000"
};

// 2° armar url
const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(datosEvento.titulo)}&dates=${datosEvento.inicio}/${datosEvento.fin}&details=${encodeURIComponent(datosEvento.descripcion)}&location=${encodeURIComponent(datosEvento.ubicacion)}&ctz=America/Argentina/Tucuman`;

// 3° abrir y agendar
const btnAgenda = document.getElementById('btn-agendar-calendario');
if(btnAgenda){
    btnAgenda.href = googleCalendarUrl;
    btnAgenda.target = "_blank";
}



// --- LÓGICA DEL CARRUSEL ---
const trackAuto = document.getElementById('track-fotos-auto');
const btnIzquierdaAuto = document.querySelector('.flecha-izq');
const btnDerechaAuto = document.querySelector('.flecha-der');

// Configuración
const autoPlaySpeed = 3000; // 3 segundos por foto
let autoPlayInterval;

// Función de movimiento (Siempre hacia adelante)
function moverCarruselAdelante() {
    const anchoSlide = trackAuto.clientWidth; // Ancho visible
    const posicionActual = trackAuto.scrollLeft;
    const anchoTotal = trackAuto.scrollWidth;

    // Si estamos en la última foto (o cerca del final)
    if (posicionActual + anchoSlide >= anchoTotal - 10) {
        // EFECTO CILINDRO: Volver al principio
        trackAuto.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
        // Avanzar una foto normal
        trackAuto.scrollBy({ left: anchoSlide, behavior: 'smooth' });
    }
}

// Iniciar Auto-Play
function startAutoPlay() {
    stopAutoPlay(); // Limpiamos por seguridad
    autoPlayInterval = setInterval(moverCarruselAdelante, autoPlaySpeed);
}

// Detener Auto-Play
function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// --- EVENTOS ---

// Iniciar al cargar
startAutoPlay();

// Pausar si el usuario toca (para ver la foto tranquilo)
trackAuto.addEventListener('touchstart', stopAutoPlay, { passive: true });
trackAuto.addEventListener('mouseenter', stopAutoPlay);

// Reanudar al soltar
trackAuto.addEventListener('touchend', startAutoPlay);
trackAuto.addEventListener('mouseleave', startAutoPlay);


// --- FLECHAS PC ---
btnDerechaAuto.addEventListener('click', () => {
    stopAutoPlay();
    moverCarruselAdelante(); // Usamos la misma lógica
    setTimeout(startAutoPlay, 5000); // Reanudar después de 5s
});

btnIzquierdaAuto.addEventListener('click', () => {
    stopAutoPlay();
    // Para atrás es simple
    trackAuto.scrollBy({ left: -trackAuto.clientWidth, behavior: 'smooth' });
    setTimeout(startAutoPlay, 5000);
});



// --- FORMULARIO ---
const scriptURL = 'https://script.google.com/macros/s/AKfycbxVyr8Rz8GPTzG_Jn9jn1drEA_PVcv4bVAHPM6sYrQJqllKiY3wPkUtiLdDWp48JtWj/exec';

// Elementos del DOM
const form = document.getElementById('form-rsvp');
const btnEnviar = document.getElementById('btn-enviar');
const msgExito = document.getElementById('mensaje-exito');
const inputNombre = document.getElementById('nombre');
const dataList = document.getElementById('lista-invitados');

const inputHiddenCantidad = document.getElementById('cantidad_total');

// Variable global
let baseDatosInvitados = []; 

// ==========================================
// 1. CARGAR LISTA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    inputNombre.placeholder = "Cargando lista...";
    inputNombre.disabled = true;

    fetch(scriptURL)
        .then(response => response.json())
        .then(data => {
            baseDatosInvitados = data; 

            // Llenamos el DataList
            baseDatosInvitados.forEach(item => {
                const option = document.createElement('option');
                option.value = item.nombre; 
                dataList.appendChild(option);
            });

            inputNombre.placeholder = "Busca tu nombre o familia...";
            inputNombre.disabled = false;
            
            checkUrlParams();
        })
        .catch(error => {
            console.error("Error cargando lista:", error);
            inputNombre.placeholder = "Error de conexión. Intenta recargar.";
            inputNombre.disabled = false;
        });
});

// ==========================================
// 2. LÓGICA DE BÚSQUEDA (SILENCIOSA)
// ==========================================
inputNombre.addEventListener('input', () => {
    const valorActual = inputNombre.value;
    const invitadoEncontrado = baseDatosInvitados.find(i => i.nombre === valorActual);

    if (invitadoEncontrado) {        
        const cant = invitadoEncontrado.cantidad || 1;
        inputHiddenCantidad.value = cant;

    } else {
        // Si escribe un nombre nuevo, asumimos 1 persona
        inputHiddenCantidad.value = "1"; 
    }
});

// ==========================================
// 3. ENVÍO DEL FORMULARIO
// ==========================================
form.addEventListener('submit', e => {
    e.preventDefault();

    if (inputNombre.value.trim() === "") {
        alert("Por favor escribe un nombre.");
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.innerText = "Procesando...";
    

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            msgExito.style.display = "block";
            form.reset(); 
            btnEnviar.style.display = "none"; 
        })
        .catch(error => {
            console.error('Error!', error.message);
            btnEnviar.innerText = "Error, intentar de nuevo";
            btnEnviar.disabled = false;
            alert("Hubo un error al enviar. Revisa tu conexión.");
        });
});

// ==========================================
// 4. CHECK URL (SILENCIOSO)
// ==========================================
function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const invitadoParam = params.get('invitado');
    const paxParam = params.get('pax');

    if (invitadoParam) {
        const nombreDecodificado = invitadoParam.replace(/-/g, ' '); 
        inputNombre.value = nombreDecodificado;

        if (paxParam) {
            // Solo guardamos el dato, sin mostrar nada
            inputHiddenCantidad.value = paxParam;
        }
        
        // Disparamos validación interna
        inputNombre.dispatchEvent(new Event('input'));
    }
}


// --- LOGICA DEL BOTON PARA COPIAR ALIAS ---
function copiarCBU(textoACopiar, idMensaje) {
    
    // 1. Usamos la API del portapapeles directamente con el texto que recibimos
    navigator.clipboard.writeText(textoACopiar)
        .then(() => {
            // 2. Buscamos EL mensaje especifico por su ID único
            const aviso = document.getElementById(idMensaje);
            
            // 3. Lo mostramos
            aviso.style.display = 'block';
            
            // 4. Lo ocultamos a los 2 segundos
            setTimeout(() => {
                aviso.style.display = 'none';
            }, 2000);
        })
        .catch(err => {
            console.error('Error al copiar: ', err);
        });
}



// --- LÓGICA CARGA Y ENVÍO CÁPSULA DEL TIEMPO ---
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-capsula");
    const btnAbrir = document.querySelector("#seccion-capsula button"); // Tu botón "DEJAR UN RECUERDO"
    const btnCerrar = document.getElementById("btn-cerrar-capsula");
    const inputFile = document.getElementById("capsula-foto");
    const labelArchivo = document.getElementById("nombre-archivo");
    const formCapsula = document.getElementById("form-capsula");
    const feedback = document.getElementById("feedback-capsula");
    const btnEnviar = document.getElementById("btn-enviar-capsula");

    // Abrir Modal
    btnAbrir.addEventListener("click", () => { modal.style.display = "flex"; });

    // Cerrar Modal
    btnCerrar.addEventListener("click", () => { modal.style.display = "none"; });
    window.addEventListener("click", (e) => { if (e.target == modal) modal.style.display = "none"; });

    // Mostrar nombre de archivo seleccionado
    inputFile.addEventListener("change", function() {
        if (this.files && this.files[0]) {
            if(this.files[0].size > 2097152){ // Limite 2MB
                alert("La imagen es muy pesada (Máx 2MB)");
                this.value = "";
            } else {
                labelArchivo.textContent = "📷 " + this.files[0].name;
            }
        }
    });

    // Enviar Formulario
    formCapsula.addEventListener("submit", e => {
        e.preventDefault();
        btnEnviar.disabled = true;
        btnEnviar.innerText = "Subiendo recuerdo...";

        const lector = new FileReader();
        const archivo = inputFile.files[0];

        // Función para enviar datos (con o sin foto)
        const enviarDatos = (base64Foto = "") => {
            const datos = new FormData();
            datos.append("tipoFormulario", "capsula");
            datos.append("nombre", document.getElementById("capsula-nombre").value);
            datos.append("mensaje", document.getElementById("capsula-mensaje").value);
            datos.append("foto", base64Foto);
            // Mimetype si hay foto
            if(archivo) datos.append("mimeType", archivo.type);

            fetch(scriptURL, { method: "POST", body: datos })
            .then(r => {
                feedback.style.display = "block";
                feedback.style.color = "white";
                feedback.innerText = "¡Recuerdo guardado en la cápsula! ✅";
                formCapsula.reset();
                labelArchivo.textContent = "Ningún archivo seleccionado";
                setTimeout(() => {
                    modal.style.display = "none";
                    feedback.style.display = "none";
                    btnEnviar.disabled = false;
                    btnEnviar.innerText = "GUARDAR RECUERDO";
                }, 3000);
            })
            .catch(error => {
                console.error(error);
                feedback.innerText = "Error al guardar.";
                btnEnviar.disabled = false;
            });
        };

        if (archivo) {
            lector.onload = function(e) {
                // Obtenemos el string base64 sin la cabecera data:image...
                const base64 = e.target.result.split(",")[1];
                enviarDatos(base64);
            };
            lector.readAsDataURL(archivo);
        } else {
            enviarDatos(); // Enviar sin foto
        }
    });
});
