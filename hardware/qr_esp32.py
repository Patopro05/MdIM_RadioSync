import cv2
import numpy as np
import pyzbar.pyzbar as pyzbar
import urllib.request
import requests # NUEVO: El mensajero para hablar con Django

font = cv2.FONT_HERSHEY_PLAIN

# IP del ESP32-CAM (Asegúrate de que siga siendo la misma)
url = 'http://172.20.10.3/'

# NUEVO: La ventanilla de tu backend donde recibe los QRs
DJANGO_URL = 'http://127.0.0.1:8000/api/login-qr/'

cv2.namedWindow("ESP32-CAM QR", cv2.WINDOW_AUTOSIZE)

prev = ""

while True:
    try:
        # Obtener imagen desde ESP32-CAM
        img_resp = urllib.request.urlopen(url + 'cam-lo.jpg')

        # Convertir imagen
        imgnp = np.array(bytearray(img_resp.read()), dtype=np.uint8)
        frame = cv2.imdecode(imgnp, -1)

        # Detectar QR
        decodedObjects = pyzbar.decode(frame)

        for obj in decodedObjects:
            # Obtener datos del QR
            data = obj.data.decode("utf-8")

            # Evitar repetir el mismo QR como metralleta
            if prev != data:
                print("\n----------------------------------")
                print("📷 QR Detectado:", data)
                prev = data

                # NUEVO: Enviar el ID a Django
                try:
                    print("🚀 Enviando a Django...")
                    payload = {'qr_code': data}
                    
                    # Hacemos la petición POST al backend
                    respuesta = requests.post(DJANGO_URL, json=payload)

                    # Revisamos qué nos contestó Django
                    if respuesta.status_code == 200:
                        print("✅ ¡Acceso Concedido!")
                        print("Datos del Paciente:", respuesta.json())
                    else:
                        print("❌ Acceso Denegado o Error:", respuesta.status_code, respuesta.text)
                
                except Exception as req_err:
                    print("⚠️ No se pudo conectar a Django. ¿Está prendido el servidor?", req_err)

            # Mostrar texto sobre la imagen del video
            cv2.putText(frame,
                        "ID: " + data,
                        (50, 50),
                        font,
                        2,
                        (0, 255, 0),
                        3)

        # Mostrar video
        cv2.imshow("ESP32-CAM QR", frame)

        # Salir con tecla ESC
        key = cv2.waitKey(1)
        if key == 27:
            break

    except Exception as e:
        print("ERROR DE CÁMARA:", e)

cv2.destroyAllWindows()