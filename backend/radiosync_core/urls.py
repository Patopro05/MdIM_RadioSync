from django.contrib import admin
from django.urls import path
from .api import status_check  # <--- Importamos tu nueva función

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/status/', status_check), # <--- Esta es la dirección que buscará React
]
