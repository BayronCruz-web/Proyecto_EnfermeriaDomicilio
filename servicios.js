/* =============================================
   servicios-pagina.js — Subpágina de servicios
   Carousel Bootstrap + JSON
   ============================================= */

const SERVICIOS_URL = 'https://bayroncruz-web.github.io/servicios-api/data/servicios.json';

function crearItemCarousel(servicio, index) {
    return `
        <div class="carousel-item ${index === 0 ? 'active' : ''}">
            <div class="servicio-card">
                <img src="${servicio.imagen}" class="img-fluid" alt="${servicio.titulo}">
                <div class="servicio-body">
                    <h3>${servicio.titulo}</h3>
                    <p>${servicio.descripcion_larga}</p>
                    ${servicio.requiere_prescripcion
                        ? '<h5>¡Requiere de prescripción médica</h5>'
                        : ''}
                    ${servicio.imagen_ilustrativa
                        ? '<h5>¡Imagen Ilustrativa debido a fines de confidencialidad!</h5>'
                        : ''}
                    <a href="contacto.html" class="btn btn-outline-info w-100">Solicitar Servicio</a>
                </div>
            </div>
        </div>
    `;
}

function cargarServiciosPagina() {
    const inner = document.querySelector('#carouselServicios .carousel-inner');
    if (!inner) return;

    inner.innerHTML = '<p style="padding: 20px; color: #2ba6b1;">Cargando servicios...</p>';

    fetch(SERVICIOS_URL)
        .then(function (response) {
            if (!response.ok) throw new Error('No se pudo cargar el archivo de servicios.');
            return response.json();
        })
        .then(function (servicios) {
            inner.innerHTML = servicios.map(crearItemCarousel).join('');
        })
        .catch(function (error) {
            console.error('Error:', error);
            inner.innerHTML = '<p style="padding: 20px; color: #b91c1c;">⚠ No se pudieron cargar los servicios.</p>';
        });
}

document.addEventListener('DOMContentLoaded', cargarServiciosPagina);