function reproducirSonido() {
    document.getElementById("soundEffect").play();
}

let currentIndex = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    if (index >= totalSlides) currentIndex = 0;
    else if (index < 0) currentIndex = totalSlides - 1;
    else currentIndex = index;

    const offset = -currentIndex * 100;
    document.querySelector('.carousel-track').style.transform = `translateX(${offset}%)`;

    // Activar indicador
    dots.forEach(dot => dot.classList.remove('active-dot'));
    dots[currentIndex].classList.add('active-dot');
}

// Botones de navegación
document.querySelector('.prev')?.addEventListener('click', () => showSlide(currentIndex - 1));
document.querySelector('.next')?.addEventListener('click', () => showSlide(currentIndex + 1));

// Cambio automático cada 3 segundos
setInterval(() => showSlide(currentIndex + 1), 3000);

// Indicadores (puntos)
dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
});