
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
  const {qr,nombre,id,estudio}=location.state;

  // URL COMPLETA DEL QR
  const qrImage = `http://127.0.0.1:8000${qr}`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(qrImage);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${id}_QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error descargando QR:", error);
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
            <img
              src={qrImage}
              alt="QR Paciente"
            />
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