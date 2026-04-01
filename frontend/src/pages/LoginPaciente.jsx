import './Login.css';
import { useState } from 'react';

function LoginPaciente() {
  const [codigo, setCodigo] = useState('');

  const handleAccess = () => {
    console.log("Código paciente:", codigo);
  };

  return (
    <div className="container">
      <div className="overlay">

        <h1>Acceso Paciente</h1>

        <div className="input-group">
          <div className="icon-logpat"></div>
          <input
            type="text"
            placeholder="Número de usuario/Escanear QR"
            value={codigo} /*CONECTAR AQUI CON LO QUE DEVUELVA EL ESP32*/
            onChange={(e) => setCodigo(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleAccess}>
          Acceder
        </button>

        <footer>2026 RadioSync v1.0</footer>

      </div>
    </div>
  );
}

export default LoginPaciente;