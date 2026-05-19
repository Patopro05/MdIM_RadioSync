from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.conf import settings
from .models import Paciente
import random
import qrcode
import os
from datetime import date # <-- NUEVO IMPORT PARA CALCULAR LA EDAD

@api_view(['POST'])
def login_qr_paciente(request):
    qr_data = request.data.get('qr_code') 
    
    if not qr_data:
        return Response({'error': 'No se detectó ningún código QR'}, status=400)
        
    try:
        usuario = User.objects.get(username=qr_data)
        paciente = Paciente.objects.get(usuario=usuario)
        
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
    # --- GET: EL MÉDICO PIDE LA LISTA ---
    if request.method == 'GET':
        pacientes = Paciente.objects.all()
        lista_datos = []
        
        for p in pacientes:
            id_visual = p.usuario.username if p.usuario else f"INT-{p.id}"
            
            # 1. Extraemos los datos REALES de la base de datos
            fecha_nac = getattr(p, 'fecha_nacimiento', None)
            sexo_real = getattr(p, 'sexo', 'No especificado')
            estudio_real = getattr(p, 'tipo_estudio', 'Rayos X') 
            hora_real = getattr(p, 'hora_estudio', 'Por definir')
            estatus_real = getattr(p, 'estatus', 'En espera')
            comentarios_reales = getattr(p, 'comentarios', '')
            
            # 2. Calculamos la edad automáticamente
            edad_calc = "Desconocida"
            if fecha_nac:
                try:
                    # Si es texto, lo convertimos a fecha
                    nac = date.fromisoformat(str(fecha_nac)) if isinstance(fecha_nac, str) else fecha_nac
                    hoy = date.today()
                    # Matemáticas de Python para sacar los años exactos
                    edad_calc = f"{hoy.year - nac.year - ((hoy.month, hoy.day) < (nac.month, nac.day))} años"
                except:
                    pass
            
            # 3. Empacamos la información completa para React
            lista_datos.append({
                'id': id_visual,
                'nombre': p.nombre_completo,
                'fecha_nacimiento': str(fecha_nac) if fecha_nac else "Sin registro",
                'edad': edad_calc,
                'sexo': sexo_real,
                'tipo_estudio': getattr(p, 'tipo_estudio', 'No especificado'),
                'hora_estudio': hora_real, 
                'estatus': estatus_real,         
                'comentarios': comentarios_reales, 
                'qr_url': f"/qrs_generados/qr_{id_visual}.png"  
            })
            
        return Response(lista_datos)

    # --- POST: EL TÉCNICO REGISTRA PACIENTE ---
    elif request.method == 'POST':
        nombre = request.data.get('nombre')
        fecha_nacimiento = request.data.get('fecha_nacimiento')
        sexo = request.data.get('sexo')
        peso_kg = request.data.get('peso_kg')
        estatura_cm = request.data.get('estatura_cm')
        
        # Atrapamos los nuevos datos del formulario técnico
        tipo_estudio = request.data.get('tipo_estudio')
        hora_estudio = request.data.get('hora_estudio')

        try:
            nuevo_username = f"PAC-{random.randint(1000, 9999)}"
            nuevo_usuario = User.objects.create_user(username=nuevo_username, password='sin_password')
            
            # Preparamos el paquete de datos base
            datos_creacion = {
                'usuario': nuevo_usuario,
                'nombre_completo': nombre,
                'fecha_nacimiento': fecha_nacimiento,
                'sexo': sexo,
                'peso_kg': peso_kg,
                'estatura_cm': estatura_cm
            }
            
            # BLINDAJE: Solo intentamos guardar el estudio si la columna existe en tu BD
            if hasattr(Paciente, 'tipo_estudio'):
                datos_creacion['tipo_estudio'] = tipo_estudio
            if hasattr(Paciente, 'hora_estudio'):
                datos_creacion['hora_estudio'] = hora_estudio
            if hasattr(Paciente, 'estatus'):
                datos_creacion['estatus'] = 'En espera'

            # Guardamos al paciente con todos sus datos disponibles
            nuevo_paciente = Paciente.objects.create(**datos_creacion)

            # Fábrica de QRs
            qr = qrcode.QRCode(version=1, box_size=10, border=4)
            qr.add_data(nuevo_username) 
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")

            qr_folder = os.path.join(settings.BASE_DIR, 'qrs_generados')
            os.makedirs(qr_folder, exist_ok=True)
            file_path = os.path.join(qr_folder, f"qr_{nuevo_username}.png")
            img.save(file_path)

            return Response({
                'id': nuevo_username,
                'nombre': nuevo_paciente.nombre_completo,
                'tipo_estudio': tipo_estudio,
                'estatus': 'En espera',
                'qr_url': f"/qrs_generados/qr_{nuevo_username}.png" 
            }, status=201)

        except Exception as e:
            return Response({'error': str(e)}, status=400)


@api_view(['PATCH'])
def actualizar_dictamen_paciente(request, pk):
    try:
        usuario = User.objects.get(username=pk)
        paciente = Paciente.objects.get(usuario=usuario)
    except (User.DoesNotExist, Paciente.DoesNotExist):
        return Response({'error': 'El expediente del paciente no fue encontrado.'}, status=404)

    if request.method == 'PATCH':
        nuevos_comentarios = request.data.get('comentarios')
        nuevo_estatus = request.data.get('estatus')

        if nuevos_comentarios is not None and hasattr(paciente, 'comentarios'):
            paciente.comentarios = nuevos_comentarios
            
        if nuevo_estatus is not None and hasattr(paciente, 'estatus'):
            paciente.estatus = nuevo_estatus

        try:
            paciente.save()
        except Exception:
            pass 

        return Response({
            'status': 'success',
            'mensaje': f'Dictamen de {paciente.nombre_completo} actualizado.'
        })