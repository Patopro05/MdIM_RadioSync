from django.urls import path
from . import views

urlpatterns = [
    path('api/qr-login/', views.login_qr_paciente, name='qr_login'),
]