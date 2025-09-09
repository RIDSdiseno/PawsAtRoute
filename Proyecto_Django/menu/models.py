from django.db import models

# Create your models here.

class Rol(models.Model):
    idRol = models.AutoField(primary_key=True,verbose_name='Id del rol')
    nombre = models.CharField(max_length=50, null=False,blank=False)

    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    idUsuario =models.AutoField(primary_key=True,verbose_name='Id del usuario')
    rut = models.CharField(max_length=13,null=False, blank=False)
    nombre = models.CharField(max_length=15,null=False, blank=False)
    apellido = models.CharField(max_length=20, null=False, blank=False)
    telefono = models.CharField(max_length=15,null=False, blank=False)
    fNacimiento = models.DateField(null=False, blank=False)
    correo = models.EmailField(max_length=254,null=False, blank=False)
    clave = models.CharField(max_length=12,null=False,blank=False)
    rol = models.ForeignKey(Rol, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.nombre
    
class Mascota(models.Model):
    idMascota = models.AutoField(primary_key=True,verbose_name='Id de la mascota')
    nombre = models.CharField(max_length=30,null=False, blank=False)
    especie = models.CharField(max_length=30,null=False, blank=False)
    raza = models.CharField(max_length=30,null=False, blank=False)
    edad = models.IntegerField(null=False, blank=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.nombre
    
class Paseo(models.Model):
    idPaseo = models.AutoField(primary_key=True,verbose_name='Id del paseo')
    fecha = models.DateField(null=False, blank=False)
    hora = models.TimeField(null=False, blank=False)
    duracion = models.IntegerField(null=False, blank=False) # Duracion en minutos
    lugarEncuentro = models.CharField(max_length=100,null=False, blank=False)
    usuario = models.ForeignKey(Usuario, on_delete=models.DO_NOTHING)
    mascota = models.ForeignKey(Mascota, on_delete=models.DO_NOTHING)

    def __str__(self):
        return f"Paseo de {self.mascota.nombre} por {self.duracion} minutos"