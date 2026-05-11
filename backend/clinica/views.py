from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Paciente
import random

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
    
@api_view(['GET', 'POST'])
def gestion_pacientes(request):
    # Cuando React pide la lista para llenar la tabla (GET)
    if request.method == 'GET':
        pacientes = Paciente.objects.all()
        lista_datos = []
        
        for p in pacientes:
            id_visual = p.usuario.username if p.usuario else f"INT-{p.id}"

            lista_datos.append({
                'id': id_visual,
                'nombre': p.nombre_completo,
                'estudio': 'Rayos X - Por definir', 
                'estatus': 'En espera'
            })
            
        return Response(lista_datos)

    # Cuando el Técnico llena el formulario y le da "Registrar" (POST)
    elif request.method == 'POST':
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        sexo = request.data.get('sexo')
        peso_kg = request.data.get('peso_kg')
        estatura_cm = request.data.get('estatura_cm')
        tipo_estudio = request.data.get('tipo_estudio')

        try:
            import random
            nuevo_username = f"PAC-{random.randint(1000, 9999)}"
            nuevo_usuario = User.objects.create_user(username=nuevo_username, password='sin_password')
            
            # Solo creamos al paciente UNA VEZ, con todos sus datos biométricos
            nuevo_paciente = Paciente.objects.create(
                usuario=nuevo_usuario,
                nombre_completo=nombre,
                fecha_nacimiento=fecha_nacimiento,
                sexo=sexo,
                peso_kg=peso_kg,
                estatura_cm=estatura_cm
            )

            return Response({
                'id': nuevo_username,
                'nombre': nuevo_paciente.nombre_completo,
                'estudio': tipo_estudio,
                'estatus': 'En espera'
            }, status=201)

        except Exception as e:
            # Si Django rechaza el paquete, nos dice por qué
            return Response({'error': str(e)}, status=400)