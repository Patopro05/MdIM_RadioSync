import { useEffect } from "react"; // <--- ESTA ES LA LÍNEA MÁGICA QUE FALTA
import "./QRSuccess.css";

import {
  Download,
  Printer,
  ArrowLeft
} from "lucide-react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";


export default function QRSuccess() {

  const navigate = useNavigate();
  const location = useLocation();
  const { qr, nombre, id, estudio } = location.state || {};

  // URL COMPLETA DEL QR
 // 2. URL segura
  const backendURL = "http://127.0.0.1:8000";
  const qrImage = qr 
    ? (qr.startsWith('http') ? qr : `${backendURL}${qr.startsWith('/') ? '' : '/'}${qr}`)
    : ""; // Si no hay qr, queda vacío

  // 3. REDIRECCIÓN DE EMERGENCIA: Si alguien entró directo o se perdieron los datos, lo regresamos al técnico
  useEffect(() => {
    if (!location.state) {
      navigate('/tecnico');
    }
  }, [location.state, navigate]);

  // Si no hay datos, ocultamos la pantalla para que no se vea rota mientras el useEffect hace la redirección
  if (!location.state) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImage);
      if (!response.ok) throw new Error("No se pudo cargar la imagen del servidor");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${id}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error descargando QR:", error);
      window.open(qrImage, '_blank');
    }
  };

  return (
    <div className="qr-page">
      <div className="qr-overlay">
        {/*backtrack bttn */}
        <button
          className="back-btn"
          onClick={() => navigate("/tecnico")}
        >
          <ArrowLeft size={20} />
          Regresar
        </button>

        <div className="qr-card">
          <h1>Código QR Generado</h1>
          <p className="success-text">
            El paciente fue registrado correctamente
          </p>
          {/*qr*/}
          <div className="qr-container">
           {qrImage ? (
              <img src={qrImage} alt="QR Paciente" />
            ) : (
              <p style={{color: 'black', textAlign: 'center'}}>QR no generado</p>
            )}
          </div>
          {/* INFO PACIENTE */}
          <div className="patient-info">
            <div className="info-row">
              <span>Paciente</span>
              <p>{nombre}</p>
            </div>

            <div className="info-row">
              <span>Estudio</span>
              <p>{estudio}</p>
            </div>

            <div className="info-row">
              <span>ID</span>
              <p>{id}</p>
            </div>
          </div>

          {/* BOTONES */}
          <div className="qr-buttons">
            <button
              className="download-btn"
              onClick={handleDownload}
            >
              <Download size={20} />
              Descargar
            </button>

            <button
              className="print-btn"
              onClick={handlePrint}
            >
              <Printer size={20} />
              Imprimir
            </button>
          </div>
        </div>
      </div>
    </div>

  );

}