from django.contrib import admin
from django.urls import path, include # <-- Agrega 'include' aquí
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def server_status(request):
    return JsonResponse({"status": "Sistema RadioSync Operativo 🟢"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/status/', server_status),

# --- RUTAS DE SEGURIDAD JWT ---
    # Aquí el frontend mandará {username, password} y recibirá el Token
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    # Cuando el token expire, el frontend usa esta ruta para renovarlo sin pedir contraseña
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Conectamos las rutas de la clínica
    path('', include('clinica.urls')), # <-- Agrega esta línea
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)