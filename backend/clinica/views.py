from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Paciente

@api_view(['POST'])
def login_qr_paciente(request):
    # El Arduino/Frontend nos mandará el número leído del QR
    qr_data = request.data.get('qr_code') 
    
    if not qr_data:
        return Response({'error': 'No se detectó ningún código QR'}, status=400)
        
    try:
        # 1. Buscamos si existe un usuario con ese número (Ej: 2010356)
        usuario = User.objects.get(username=qr_data)
        
        # 2. Verificamos que ese usuario tenga un expediente de Paciente
        paciente = Paciente.objects.get(usuario=usuario)
        
        # 3. Si todo está bien, le respondemos al Frontend con sus datos
        return Response({
            'status': 'success',
            'mensaje': 'Acceso concedido',
            'datos_paciente': {
                'id_interno': paciente.id,
                'nombre': paciente.nombre_completo,
                'numero_usuario': usuario.username
            }
        })
        
    except User.DoesNotExist:
        return Response({'error': 'Código QR no válido. Paciente no encontrado.'}, status=404)
    except Paciente.DoesNotExist:
        return Response({'error': 'El usuario existe, pero no tiene expediente clínico asignado.'}, status=404)