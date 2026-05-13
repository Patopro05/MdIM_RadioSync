import "./DashboardMedico.css";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardMedico() {
  const [paciente, setPaciente] = useState(null);
  const [estado, setEstado] = useState("pendiente");
  const [comentarios, setComentarios] = useState("");

  useEffect(() => {
    // Recuperar paciente guardado en login la nt no se si sí sea así pero ahí lo checas
    const datosPaciente = JSON.parse(localStorage.getItem("paciente")
    );

    if (datosPaciente) {
      setPaciente(datosPaciente);
    }
  }, []);

  const cambiarEstado = () => {
      //esto tmb lo cambias ahí como veas, los estilos como quiera pss estan en el css
    if (estado === "pendiente") {
      setEstado("proceso");
    }
    else if (estado === "proceso") {
      setEstado("realizado");
    }
    else {
      setEstado("pendiente");
    }
  };

  const obtenerTextoEstado = () => {
    if (estado === "pendiente") {
      return "Pendiente por realizar";
    }
    if (estado === "proceso") {
      return "Estudio en proceso";
    }
    return "Estudio realizado";
  };

  return (
    <div className="medico-container">
      <div className="medico-overlay">
        <h1 className="section-title">
          FICHA DE IDENTIFICACIÓN
        </h1>

        <div className="info-card">
          <div className="top-name">
            <div className="input-box full">
              <label>Nombre Completo</label>
              <p>
                {paciente?.nombre || "Sin datos"}
              </p>
            </div>
          </div>
          <div className="bottom-row">
            <div className="input-box">
              <label>Fecha de nacimiento</label>
              <p>
                {/* aquí segun yo es donde hay que conectar con la bdd */}
                {paciente?.fecha_nacimiento || "dd / mm / aaaa"} 
              </p>
            </div>

            <div className="input-box small">
              <label>Edad</label>
              <p>
                {paciente?.edad || "Edad"}
              </p>
            </div>

            <div className="input-box small">
              <label>Sexo</label>
              <p>
                {paciente?.sexo || "Sexo"}
              </p>
            </div>
          </div>
        </div>

        <h1 className="section-title second-title">
          DATOS DEL ESTUDIO
        </h1>

        <div className="study-grid">
          <div className="left-side">
            <div className="input-box">
              <label>ID del paciente</label>
              <p>
                {paciente?.numero_usuario ||paciente?.id ||"PAC-0000"}
              </p>
            </div>
            <div className="input-box">
              <label>Estudio solicitado</label>
              <p>
                {paciente?.estudio ||"Rayos X"}
              </p>
            </div>
          </div>

          <div className="middle-side">
            <div className="input-box">
              <label>Fecha de Solicitud</label>
              <p>
                {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="estado-container">
              <label>Estado</label>
              <div className="estado-row">
                <div
                  className={`estado-dot ${estado}`}
                ></div>
                <span>
                  {obtenerTextoEstado()}
                </span>
              </div>

              <button
                className="estado-btn"
                onClick={cambiarEstado}
              >
                Actualizar Estado
              </button>
            </div>
          </div>

          <div className="comments-side">
            <label>Comentarios</label>
            <textarea
              value={comentarios}
              onChange={(e) =>
                setComentarios(e.target.value)
              }
              placeholder="Agregar observaciones..."
            ></textarea>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DashboardMedico;