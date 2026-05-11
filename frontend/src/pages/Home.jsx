import './Home.css';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [modal, setModal] = useState("");
  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2>RADIOSYNC</h2>

        <div className="nav-links">
          <button onClick={() => navigate("/personal")}>
              Inicio
            </button>
          <span onClick={() => setModal("acerca")}>Acerca de</span>
          <span onClick={() => setModal("estudios")}>Estudios</span>
          <span onClick={() => setModal("contacto")}>Contacto</span>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-card">
          <h1>RADIOSYNC</h1>

          <p>
            RadioSync planea ser una plataforma de orquestación diseñada
            específicamente para digitalizar y optimizar el flujo completo
            de trabajo radiológico.
          </p>

          <div className="hero-buttons">
            <button onClick={() => navigate("/paciente")}>
              Consultar Paciente
            </button>

            <button onClick={() => navigate("/personal")}>
              Agendar Estudio
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h3>RADIOSYNC</h3>
          <p>Inicio</p>
          <span onClick={() => setModal("acerca")}>Acerca de</span>
          <p><span onClick={() => setModal("estudios")}>Estudios</span></p>
        </div>

        <div>
          <h3>DE INTERÉS</h3>
          <p>Centro Universitario de Imagen Diagnóstica</p>
          <p><button onClick={() => window.location.href = 'https://www.medicina.uanl.mx/hu/'}>Hospital Universitario</button></p>
        </div>

        <div>
          <h3>ESTUDIOS</h3>
          <p>Rayos X</p>
          <p>Mamografía</p>
          <p>Tomografía Computarizada</p>
        </div>
      </footer>

    

    {modal && (
      <div className="modal-overlay" onClick={() => setModal("")}>

        <div className="modal-box" onClick={(e) => e.stopPropagation()}>

          <button className="close-btn" onClick={() => setModal("")}>
            ✕
          </button>

          {modal === "acerca" && (
            <>
              <h2>Acerca de RadioSync</h2>

              <p>
                RadioSync es una plataforma diseñada por estudiantes para optimizar
                el flujo radiológico hospitalario mediante la digitalización,
                gestión de pacientes y acceso mediante QR.
              </p>
            </>
          )}

          {modal === "estudios" && (
            <>
              <h2>Estudios Disponibles</h2>

              <ul>
                <li>Rayos X</li>
                <li>Tomografía</li>
                <li>Resonancia Magnética</li>
              </ul>
            </>
          )}

          {modal === "contacto" && (
            <>
              <h2>Contacto</h2>

              <p>Hospital Universitario UANL</p>
              <p>deptoradiologia@uanl.mx</p>
              <p>###########</p>
            </>
          )}

        </div>

      </div>

    )}
    </div>
  );
  
}

export default Home;