from django.urls import path
from . import views

urlpatterns = [
    path('api/qr-login/', views.login_qr_paciente, name='qr_login'),
    path('api/pacientes/', views.gestion_pacientes, name='gestion_pacientes'),
    # La ruta para que el paciente inicie sesión con su QR
    path('api/login-qr/', views.login_qr_paciente, name='login_qr'),
]