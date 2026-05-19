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

        // 🟢 EL TRUCO MAESTRO: Preparamos la memoria para la pantalla híbrida
        localStorage.setItem("paciente", JSON.stringify(respuesta.data.datos_paciente));
        localStorage.setItem("rol", "paciente"); // Bloquea la Worklist en el Dash
        localStorage.setItem("mi_id_paciente", respuesta.data.datos_paciente.numero_usuario); // PAC-XXXX

        // Lo mandamos a la hoja compartida
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

        {/* 🟢 BOTÓN PARA REGRESAR A LA LANDING PAGE */}
        <button 
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            color: '#bfc7d5',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '20px',
            padding: 0,
            width: 'fit-content'
          }}
        >
          ← Regresar al inicio
        </button>

        <h1>Acceso Paciente</h1>

        <div className="input-group">
          <div className="icon-logpat"></div>
          <input
            type="text"
            placeholder="Número de usuario/Escanear QR"
            value={codigo} /* CONECTAR AQUI CON LO QUE DEVUELVA EL ESP32 */
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