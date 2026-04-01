import { useNavigate } from "react-router-dom";
import './Home.css';

function Home() {
    const navigate = useNavigate();
  return (
    <div className="container">
      
      <div className="overlay">
        <h1>
          Bienvenido a <br />
          <span>RadioSync</span>
        </h1>

        <div className="options">
          <div className="card">
            <p>Paciente</p>
            <button className="icon-pat"onClick={() => navigate("/paciente")}></button>
          </div>

          <div className="card">
            <p>Personal</p>
            <button className="icon-rad"onClick={() => navigate("/personal")}></button>
          </div>
        </div>
        
        <footer>2026 RadioSync v1.0</footer>
      </div>

    </div>
  );
}

export default Home;