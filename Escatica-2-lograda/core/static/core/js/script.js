document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("container");
    const registerBtn = document.getElementById("register");
    const loginBtn = document.getElementById("login");

    if (registerBtn && loginBtn) {
        registerBtn.addEventListener("click", () => container.classList.add("active"));
        loginBtn.addEventListener("click", () => container.classList.remove("active"));
    }

    // Modal
    const modal = document.getElementById('customModal');
    const closeModalBtn = document.getElementById('modalCancelBtn');
    const continueBtn = document.getElementById('modalContinueBtn');
    const redirectFlag = document.getElementById('redirectAfterModal');

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            modal.classList.remove('show');

            // Redirigir si es login exitoso
            if (redirectFlag) {
                window.location.href = "/menuUser/"; // Cambia a tu ruta protegida real
            }
        });
    }
});
    // Interceptar formularios si hay mensajes
    const registerForm = document.getElementById("registerForm");
    const loginForm = document.getElementById("loginForm");

    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            if (messages.length > 0) {
                e.preventDefault();
                formToSubmit = registerForm;
                modal.style.display = "flex";
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            if (messages.length > 0) {
                e.preventDefault();
                formToSubmit = loginForm;
                modal.style.display = "flex";
            }
        });
    }
