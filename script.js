function validarFormulario() {
    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value;
    const rangoIngreso = document.getElementById("rangoIngreso").value;
    const mensaje = document.getElementById("mensaje").value.trim();
    const formMessage = document.getElementById("formMessage");

    // Género (radio button)
    const generoSeleccionado = document.querySelector('input[name="genero"]:checked');

    // Grado académico (al menos un checkbox marcado)
    const gradoSeleccionado = document.querySelectorAll('input[name="gradoAcademico"]:checked');

    if (nombre === "" || email === "" || fechaNacimiento === "" || rangoIngreso === "" || mensaje === "") {
        formMessage.style.color = "red";
        formMessage.textContent = "Por favor complete todos los campos obligatorios.";
        return false;
    }

    if (!generoSeleccionado) {
        formMessage.style.color = "red";
        formMessage.textContent = "Por favor seleccione su género.";
        return false;
    }

    if (gradoSeleccionado.length === 0) {
        formMessage.style.color = "red";
        formMessage.textContent = "Por favor seleccione al menos un grado académico.";
        return false;
    }

    formMessage.style.color = "green";
    formMessage.textContent = "Mensaje enviado correctamente.";
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