from django.db import models
from django.contrib.auth.models import User

class Paciente(models.Model):
    # Datos de identificación y biometría
    nombre_completo = models.CharField(max_length=200)
    fecha_nacimiento = models.DateField()
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Femenino'), ('O', 'Otro')])
    peso_kg = models.DecimalField(max_digits=5, decimal_places=2, help_text="Peso en kilogramos")
    estatura_cm = models.IntegerField(help_text="Estatura en centímetros")
    
    # Datos de contacto
    telefono = models.CharField(max_length=20, blank=True, null=True)
    
    # Relación opcional con el sistema de usuarios
    usuario = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Paciente: {self.nombre_completo}"

class EstudioRadiologico(models.Model):
    TIPOS_ESTUDIO = [
        ('RX_TORAX', 'Rayos X de Tórax'),
        ('RX_OSEO', 'Rayos X Óseo'),
        ('TAC', 'Tomografía Axial Computarizada'),
        ('RM', 'Resonancia Magnética'),
        ('USG', 'Ultrasonido'),
    ]

    ESTADOS = [
        ('PENDIENTE', 'Pendiente de realizar'),
        ('REALIZADO', 'Imágenes capturadas'),
        ('DICTAMINADO', 'Diagnosticado por Radiólogo'),
    ]

    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, related_name='estudios')
    tipo_estudio = models.CharField(max_length=50, choices=TIPOS_ESTUDIO)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)
    fecha_realizacion = models.DateTimeField(null=True, blank=True)
    
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')
    
    # Médicos involucrados
    tecnico_asignado = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='estudios_tecnico')
    radiologo_asignado = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='estudios_radiologo')
    
    # El diagnóstico final
    diagnostico_clinico = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.get_tipo_estudio_display()} - {self.paciente.nombre_completo}"