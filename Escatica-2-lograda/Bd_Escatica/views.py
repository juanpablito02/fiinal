from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.hashers import make_password, check_password
from .models import Usuario

def login_register(request):
    if request.method == "POST":
        if "registro" in request.POST:
            nombre = request.POST.get("nombre", "").strip()
            correo = request.POST.get("correo", "").strip().lower()
            password = request.POST.get("password", "")
            confirm_password = request.POST.get("confirmPassword", "")

            if not all([nombre, correo, password, confirm_password]):
                request.session["modal_message"] = {"type": "error", "text": "Todos los campos son obligatorios"}
                return redirect("login_register")

            if password != confirm_password:
                request.session["modal_message"] = {"type": "error", "text": "Las contraseñas no coinciden!"}
                return redirect("login_register")

            if Usuario.objects.filter(correo=correo).exists():
                request.session["modal_message"] = {"type": "error", "text": "El correo ya está en uso!"}
                return redirect("login_register")

            try:
                Usuario.objects.create(
                    nomCli=nombre,
                    correo=correo,
                    contrasenia=make_password(password)
                )
                request.session["modal_message"] = {"type": "success", "text": "Registro exitoso. Ahora puedes iniciar sesión."}
                return redirect("login_register")
            except Exception:
                request.session["modal_message"] = {"type": "error", "text": "Error al crear el usuario!"}
                return redirect("login_register")

        elif "inicio_sesion" in request.POST:
            correo = request.POST.get("correo", "").strip().lower()
            password = request.POST.get("password", "")

            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                request.session["modal_message"] = {"type": "error", "text": "Correo o contraseña, incorrectas!"}
                return redirect("login_register")

            if check_password(password, usuario.contrasenia):
                request.session["usuario_id"] = usuario.id  # <-- Agrega esta línea
                request.session["modal_message"] = {
                    "type": "success",
                    "text": f"¡Bienvenido {usuario.nomCli}!",
                    "redirect": True
                }
                return redirect("login_register")
            else:
                request.session["modal_message"] = {"type": "error", "text": "Credenciales incorrectas"}
                return redirect("login_register")

    # Manejo del mensaje y eliminación del mismo
    modal_message = request.session.get("modal_message")
    if modal_message:
        del request.session["modal_message"]

    return render(request, "core/login.html", {"modal_message": modal_message})



