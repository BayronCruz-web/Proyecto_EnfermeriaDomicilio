/* =============================================
   script.js — Lógica general del sitio
   ============================================= */


/* ---------- CARRUSEL DE SERVICIOS ---------- */

const SERVICIOS_URL = 'https://bayroncruz-web.github.io/servicios-api/data/servicios.json';

function crearCardServicio(servicio) {
    return `
        <div class="servicio-card" id="servicio-${servicio.id}">
            <img src="${servicio.imagen}" alt="${servicio.titulo}">
            <div class="servicio-body">
                <h3>${servicio.titulo}</h3>
                <p>${servicio.descripcion_corta}</p>
                ${servicio.requiere_prescripcion
                    ? '<h5>¡Requiere de prescripción médica!</h5>'
                    : ''}
                ${servicio.imagen_ilustrativa
                    ? '<h5>¡Imagen ilustrativa debido a fines de confidencialidad!</h5>'
                    : ''}
                <a href="servicios.html" class="servicio-btn">Saber más</a>
            </div>
        </div>
    `;
}

function iniciarCarrusel() {
    const track = document.querySelector('.servicios-track');
    const clip = document.querySelector('.servicios-clip');
    const btnPrev = document.querySelector('.servicios-btn-prev');
    const btnNext = document.querySelector('.servicios-btn-next');

    if (!track || !clip || !btnPrev || !btnNext) return;

    const cards = track.querySelectorAll('.servicio-card');
    const totalCards = cards.length;
    if (totalCards === 0) return;

    let indice = 0;

    function getVisibles() {
        const ancho = clip.offsetWidth;
        if (ancho >= 768) return 3;
        if (ancho >= 540) return 2;
        return 1;
    }

    function mover(direccion) {
        const visibles = getVisibles();
        const maxIndice = totalCards - visibles;
        indice = Math.max(0, Math.min(indice + direccion, maxIndice));


        const gap = parseFloat(getComputedStyle(track).gap) || 16;
        const anchoCard = (clip.offsetWidth - (gap * (visibles - 1))) / visibles;

        track.style.transform = `translateX(-${indice * (anchoCard + gap)}px)`;

        btnPrev.disabled = indice === 0;
        btnNext.disabled = indice >= maxIndice;
    }

    // Estado inicial
    btnPrev.disabled = true;
    btnNext.disabled = totalCards <= getVisibles();

    btnPrev.addEventListener('click', function () { mover(-1); });
    btnNext.addEventListener('click', function () { mover(1); });
    window.addEventListener('resize', function () {
        indice = Math.min(indice, totalCards - getVisibles());
        mover(0);
    });
}

function cargarServicios() {
    const track = document.querySelector('.servicios-track');
    if (!track) return;

    track.innerHTML = '<p style="padding: 20px; color: #2ba6b1;">Cargando servicios...</p>';

    fetch(SERVICIOS_URL)
        .then(function (response) {
            if (!response.ok) throw new Error('No se pudo cargar el archivo de servicios.');
            return response.json();
        })
        .then(function (servicios) {
            track.innerHTML = servicios.map(crearCardServicio).join('');
            // Iniciar carrusel DESPUÉS de que las cards están en el DOM
            iniciarCarrusel();
        })
        .catch(function (error) {
            console.error('Error:', error);
            track.innerHTML = '<p style="padding: 20px; color: #b91c1c;">⚠ No se pudieron cargar los servicios. Intentá más tarde.</p>';
        });
}


/* ---------- VALIDACIÓN FORMULARIO CON JQUERY ---------- */

function validarFormulario() {
    const nombre          = $("#nombre").val().trim();
    const email           = $("#email").val().trim();
    const fechaNacimiento = $("#fechaNacimiento").val();
    const rangoIngreso    = $("#rangoIngreso").val();
    const mensaje         = $("#mensaje").val().trim();
    const generoSel       = $('input[name="genero"]:checked').val() || '';
    const gradoSel        = $('input[name="gradoAcademico"]:checked')
                            .map(function() { return this.value; })
                            .get().join(', ');

    const $msg = $("#formMessage");

    function mostrarError(texto) {
        $msg.removeClass("mensaje-exito").addClass("mensaje-error")
            .text(texto).hide().fadeIn(350);
    }

    function mostrarExito(texto) {
        $msg.removeClass("mensaje-error").addClass("mensaje-exito")
            .text(texto).hide().fadeIn(350);
        $(".contacto-btn-submit")
            .animate({ opacity: 0.5 }, 150)
            .animate({ opacity: 1 }, 150);
    }

    // Validaciones
    if (nombre === "" || email === "" || fechaNacimiento === "" || rangoIngreso === "" || mensaje === "") {
        mostrarError("⚠ Por favor complete todos los campos obligatorios.");
        return false;
    }
    if (!$('input[name="genero"]:checked').length) {
        mostrarError("⚠ Por favor seleccione su género.");
        return false;
    }
    if (!$('input[name="gradoAcademico"]:checked').length) {
        mostrarError("⚠ Por favor seleccione al menos un grado académico.");
        return false;
    }

    const templateParams = {
        nombre:          nombre,
        email:           email,
        fechaNacimiento: fechaNacimiento,
        edad:            $("#edad").val(),
        genero:          generoSel,
        gradoAcademico:  gradoSel,
        rangoIngreso:    rangoIngreso,
        mensaje:         mensaje
    };

    $(".contacto-btn-submit").prop("disabled", true).text("Enviando...");

    emailjs.init("Y0i-tKH6-yghzNga0"); 

    emailjs.send("service_tcu10gm", "template_6586qx7", templateParams)
        .then(function () {
            mostrarExito("✓ Mensaje enviado correctamente. ¡Nos pondremos en contacto pronto!");
            $("#contactForm")[0].reset();
            $("#edadDisplay").text("");
        })
        .catch(function (error) {
            console.error("EmailJS error:", error);
            mostrarError("⚠ No se pudo enviar el mensaje. Intentá más tarde.");
        })
        .finally(function () {
            $(".contacto-btn-submit").prop("disabled", false).text("Enviar mensaje");
        });

    return false;
}


/* ---------- CÁLCULO DE EDAD ---------- */

function calcularEdad() {
    const $input = $("#fechaNacimiento");
    if (!$input.length) return;

    $input.on("change", function () {
        const hoy = new Date();
        const nacimiento = new Date($(this).val());
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

        $("#edad").val(edad > 0 ? edad : "");
        $("#edadDisplay").text(edad > 0 ? "Edad calculada: " + edad + " años" : "");
    });
}


/* ---------- GOOGLE MAPS + GEOLOCALIZACIÓN ---------- */

let mapa, marcadorUsuario;

function initMapa() {
    const costaRica = { lat: 10.048741, lng: -84.244936 };

    mapa = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 12,
        center: costaRica,
        styles: [
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#a0d4e0" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "landscape", stylers: [{ color: "#f0f7f8" }] }
        ]
    });

    const infoWindowNegocio = new google.maps.InfoWindow({
        content: '<div style="font-family:sans-serif;font-size:13px;color:#0c5e6b;padding:4px 6px;">' +
            '<strong>Barrantes &amp; González</strong><br>Barrantes & González Enfermería a Domicilio<br>Costa Rica</div>'
    });

    const marcadorNegocio = new google.maps.Marker({
        position: costaRica,
        map: mapa,
        title: "Barrantes & González Enfermería",
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#2ba6b1",
            fillOpacity: 1,
            strokeColor: "#0c5e6b",
            strokeWeight: 2
        }
    });

    marcadorNegocio.addListener("click", function () {
        infoWindowNegocio.open(mapa, marcadorNegocio);
    });
    infoWindowNegocio.open(mapa, marcadorNegocio);

    document.getElementById("btnUbicacion").addEventListener("click", function () {
        const infoEl = document.getElementById("ubicacionInfo");

        if (!navigator.geolocation) {
            infoEl.textContent = "Tu navegador no soporta geolocalización.";
            return;
        }

        infoEl.textContent = "Obteniendo tu ubicación...";

        navigator.geolocation.getCurrentPosition(
            function (pos) {
                const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };

                mapa.setCenter(userPos);
                mapa.setZoom(13);

                if (marcadorUsuario) marcadorUsuario.setMap(null);

                marcadorUsuario = new google.maps.Marker({
                    position: userPos,
                    map: mapa,
                    title: "Tu ubicación",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 9,
                        fillColor: "#e8607a",
                        fillOpacity: 1,
                        strokeColor: "#b91c1c",
                        strokeWeight: 2
                    }
                });

                new google.maps.InfoWindow({
                    content: '<div style="font-family:sans-serif;font-size:13px;color:#b91c1c;padding:4px 6px;">Tu ubicación</div>'
                }).open(mapa, marcadorUsuario);

                new google.maps.Polyline({
                    path: [costaRica, userPos],
                    geodesic: true,
                    strokeColor: "#2ba6b1",
                    strokeOpacity: 0.7,
                    strokeWeight: 2,
                    map: mapa
                });

                const R = 6371;
                const dLat = (userPos.lat - costaRica.lat) * Math.PI / 180;
                const dLon = (userPos.lng - costaRica.lng) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(costaRica.lat * Math.PI / 180) *
                    Math.cos(userPos.lat * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const distancia = Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));

                infoEl.innerHTML = "✓ Ubicación detectada — estás a aproximadamente <strong>" +
                    distancia + " km</strong> de nosotros.";
            },
            function () {
                document.getElementById("ubicacionInfo").textContent =
                    "⚠ No se pudo obtener tu ubicación. Verifica los permisos del navegador.";
            }
        );
    });
}


/* ---------- INICIALIZACIÓN ---------- */

document.addEventListener('DOMContentLoaded', function () {
    cargarServicios();  // carga cards Y luego inicia el carrusel
    calcularEdad();
});
