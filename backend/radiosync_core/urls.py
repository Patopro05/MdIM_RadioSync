from django.contrib import admin
from django.urls import path, include # <-- Agrega 'include' aquí
from django.http import JsonResponse

def server_status(request):
    return JsonResponse({"status": "Sistema RadioSync Operativo 🟢"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/status/', server_status),
    
    # Conectamos las rutas de la clínica
    path('', include('clinica.urls')), # <-- Agrega esta línea
]