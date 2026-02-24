from django.contrib import admin
from .models import Paciente, EstudioRadiologico

# Registramos los modelos para verlos en el panel
admin.site.register(Paciente)
admin.site.register(EstudioRadiologico)