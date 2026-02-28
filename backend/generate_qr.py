import os
import django
import qrcode

# 1. PRIMERO: Configurar el entorno de Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'radiosync_core.settings')
django.setup()

# 2. SEGUNDO: Importar los modelos
from clinica.models import Paciente

def generate_patient_qr(patient_id):
    try:
        paciente = Paciente.objects.get(id=patient_id)
        
        # Usamos el username si existe, si no, el ID del paciente
        qr_data = paciente.usuario.username if paciente.usuario else f"PX_{paciente.id}"

        # Generar el código QR
        qr = qrcode.QRCode(version=1, box_size=10, border=4)
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")

        # Crear carpeta de salida
        qr_folder = os.path.join(os.getcwd(), 'qrs_generados')
        if not os.path.exists(qr_folder):
            os.makedirs(qr_folder)

        file_path = os.path.join(qr_folder, f"qr_{qr_data}.png")
        img.save(file_path)
        print(f"✅ QR generado con éxito en: {file_path}")
        
    except Paciente.DoesNotExist:
        print(f"❌ Error: El paciente con ID {patient_id} no existe.")

if __name__ == '__main__':
    # Intenta con el ID 1 o el que veas en tu panel de admin
    generate_patient_qr(1)