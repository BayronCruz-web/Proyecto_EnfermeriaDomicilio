function validarFormulario() {
    const nombre = $("#nombre").val().trim();
    const email = $("#email").val().trim();
    const fechaNacimiento = $("#fechaNacimiento").val();
    const rangoIngreso = $("#rangoIngreso").val();
    const mensaje = $("#mensaje").val().trim();
    const generoSeleccionado = $('input[name="genero"]:checked').length;
    const gradoSeleccionado = $('input[name="gradoAcademico"]:checked').length;

    const $msg = $("#formMessage");

    function mostrarError(texto) {
        $msg
            .removeClass("msg-exito")
            .css({
                "background": "#fef2f2",
                "color": "#b91c1c",
                "border": "1px solid #fca5a5"
            })
            .text(texto)
            .hide()
            .fadeIn(350);
    }

    function mostrarExito(texto) {
        $msg
            .css({
                "background": "#e6f6f8",
                "color": "#0c5e6b",
                "border": "1px solid #2ba6b1"
            })
            .text(texto)
            .hide()
            .fadeIn(350);

        // Shake suave del botón para feedback positivo
        $(".contacto-btn-submit")
            .animate({ opacity: 0.5 }, 150)
            .animate({ opacity: 1 }, 150);
    }

    if (nombre === "" || email === "" || fechaNacimiento === "" || rangoIngreso === "" || mensaje === "") {
        mostrarError("⚠ Por favor complete todos los campos obligatorios.");
        return false;
    }

    if (!generoSeleccionado) {
        mostrarError("⚠ Por favor seleccione su género.");
        return false;
    }

    if (gradoSeleccionado === 0) {
        mostrarError("⚠ Por favor seleccione al menos un grado académico.");
        return false;
    }

    mostrarExito("✓ Mensaje enviado correctamente. ¡Nos pondremos en contacto pronto!");
    return false;
}

/* Calcula edad automáticamente al cambiar la fecha de nacimiento */
function calcularEdad() {
    const input = document.getElementById('fechaNacimiento');
    if (!input) return;

    input.addEventListener('change', function () {
        const hoy = new Date();
        const nacimiento = new Date(this.value);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) edad--;

        document.getElementById('edad').value = edad > 0 ? edad : '';
        document.getElementById('edadDisplay').textContent =
            edad > 0 ? 'Edad calculada: ' + edad + ' años' : '';
    });
}

/* Llama la función cuando el DOM esté listo */
function initCarruselServicios() {
    const track = document.querySelector('.servicios-track');
    const cards = document.querySelectorAll('.servicio-card');
    const btnPrev = document.querySelector('.servicios-btn-prev');
    const btnNext = document.querySelector('.servicios-btn-next');

    if (!track || !cards.length) return;

    let current = 0;

    function getGap() {
        return parseInt(getComputedStyle(track).gap) || 0;
    }

    function visibles() {
        return window.innerWidth >= 768 ? 3 : 1;
    }

    function maxIndex() {
        return cards.length - visibles();
    }

    function mover() {
        const gap = getGap();
        const cardWidth = cards[0].offsetWidth + gap;
        track.style.transform = `translateX(-${current * cardWidth}px)`;
    }

    btnPrev.addEventListener('click', () => {
        current = Math.max(0, current - 1);
        mover();
    });

    btnNext.addEventListener('click', () => {
        current = Math.min(maxIndex(), current + 1);
        mover();
    });

    window.addEventListener('resize', () => {
        current = Math.min(current, maxIndex());
        mover();
    });

    mover();
}

document.addEventListener('DOMContentLoaded', initCarruselServicios);

let mapa, marcadorUsuario;
 
function initMapa() {
    const costaRica = { lat: 9.9281, lng: -84.0907 };
 
    mapa = new google.maps.Map(document.getElementById("mapa"), {
        zoom: 12,
        center: costaRica,
        styles: [
            { featureType: "water",     elementType: "geometry", stylers: [{ color: "#a0d4e0" }] },
            { featureType: "road",      elementType: "geometry", stylers: [{ color: "#ffffff" }] },
            { featureType: "landscape",                          stylers: [{ color: "#f0f7f8" }] }
        ]
    });
 
    const infoWindowNegocio = new google.maps.InfoWindow({
        content: '<div style="font-family:sans-serif;font-size:13px;color:#0c5e6b;padding:4px 6px;">' +
                 '<strong>Barrantes &amp; González</strong><br>Enfermería a Domicilio<br>Costa Rica</div>'
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
 
    /* Botón geolocalización */
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
 
                /* Distancia aproximada en km */
                const R    = 6371;
                const dLat = (userPos.lat - costaRica.lat) * Math.PI / 180;
                const dLon = (userPos.lng - costaRica.lng) * Math.PI / 180;
                const a    = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                             Math.cos(costaRica.lat * Math.PI / 180) *
                             Math.cos(userPos.lat  * Math.PI / 180) *
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