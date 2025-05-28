from django.contrib import admin
from .models import Usuario, Puntuacion

@admin.register(Usuario)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ("id", "nomCli", "correo")
    search_fields = ("nomCli", "correo")

@admin.register(Puntuacion)
class PuntuacionAdmin(admin.ModelAdmin):
    list_display = ("id", "cliente", "puntos", "medallas", "fecha_medalla")
    search_fields = ("cliente__nomCli",)
    list_filter = ("fecha_medalla",)
    