import './Home.css';
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">
        <h2>RADIOSYNC</h2>

        <div className="nav-links">
          <span>Inicio</span>
          <span>Acerca de</span>
          <span>Estudios</span>
          <span>Contacto</span>
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
          <p>Acerca de</p>
          <p>Servicios</p>
        </div>

        <div>
          <h3>DE INTERÉS</h3>
          <p>Centro Universitario de Imagen Diagnóstica</p>
          <p>Hospital Universitario</p>
        </div>

        <div>
          <h3>ESTUDIOS</h3>
          <p>Rayos X</p>
          <p>Mamografía</p>
          <p>Tomografía Computarizada</p>
        </div>
      </footer>

    </div>
  );
}

export default Home;