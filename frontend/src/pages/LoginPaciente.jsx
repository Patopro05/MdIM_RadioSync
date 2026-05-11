import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function LoginPaciente() {
  const [codigo, setCodigo] = useState('');
  const navigate = useNavigate();
  const handleAccess = async () => {
    if (!codigo) {
        alert("Ingresa un código");
        return;
      }
    try {

        // petición al backend
        const respuesta = await axios.post(
          'http://127.0.0.1:8000/api/login-qr/',
          {
            qr_code: codigo
          }
        );

        console.log(respuesta.data);

        // guardar datos del paciente
        localStorage.setItem(
          "paciente",
          JSON.stringify(respuesta.data.datos_paciente)
        );
          navigate('/medico');

      } catch (error) {

        console.error(error);

        alert(
          error.response?.data?.error ||
          "No se pudo acceder"
        );
      }

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
            onChange={(e) => setCodigo(e.target.value)}/*no se en que parte va pero la variable de qr en el back es 'qr_code'*/
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