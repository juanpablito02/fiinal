from django.db import models

class Usuario(models.Model):
    id = models.AutoField(primary_key=True)
    nomCli = models.CharField(max_length=16, verbose_name="Nombre")
    correo = models.EmailField(max_length=30, unique=True, verbose_name="Correo Electrónico")
    contrasenia = models.CharField(max_length=128, verbose_name="Contraseña")

    def __str__(self):
        return self.nomCli
    
class Puntuacion(models.Model):
    id = models.AutoField(primary_key=True)
    cliente = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="puntuaciones")
    puntos = models.PositiveIntegerField(verbose_name="Puntuación")
    medallas = models.PositiveIntegerField(default=0, verbose_name="Número de Medallas")
    fecha_medalla = models.DateField(null=True, blank=True, verbose_name="Fecha Última Medalla")

    def __str__(self):
        return f"{self.cliente.nomCli} - {self.puntos} puntos - {self.medallas} medallas"
