import './Login.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function LoginPersonal() {
  const navigate = useNavigate();

  const [Username, setUsuario] = useState('');
  const [Password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
      // 1. Tocamos la puerta de Django
      const respuesta = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: Username, 
        password: Password
      });

      // 2. ¡EL RESCATE! Guardamos los gafetes en la memoria del navegador
      localStorage.setItem('access_token', respuesta.data.access);
      localStorage.setItem('refresh_token', respuesta.data.refresh);
      console.log("Login correcto y token asegurado 🔐");

      // --- EL HACK DE DEMOSTRACIÓN BLINDADO ---
      // Usamos exactamente tu variable de estado: Username
      const userStr = String(Username).toLowerCase();

      if (userStr.includes('doc') || userStr.includes('med')) {
        navigate('/medico');
      } else {
        navigate('/tecnico');
      }

    } catch (error) {
      console.error("Detalle del rechazo de Django:", error.response?.data);
      alert("Error al iniciar sesión. Revisa la consola.");
    }
  };

  return (
    <div className="container">

      <div className="overlay">

        <h1>Iniciar sesión</h1>

        <p className="login-subtitle">
          Accede como personal para gestionar estudios
        </p>

        {/* INPUT USUARIO */}
        <div className="input-group">
          <span className="icon-loguser"><a href="https://www.flaticon.com/free-icons/user" title="user icons"></a></span>
          <input
            type="text"
            placeholder="Usuario"
            value={Username}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        {/* INPUT PASSWORD */}
        <div className="input-group">
          <span className="icon-pasw"><a href="https://www.flaticon.com/free-icons/padlock" title="padlock icons"></a></span>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span 
            className="eye"
            onClick={() => setShowPassword(!showPassword)}
          ><a href="https://www.flaticon.com/free-icons/eyes" title="eyes icons"></a>
          </span>
        </div>

        {/* OPCIONES */}
        <div className="options">
          <span>Recuérdame</span>
          <span className="link">¿Olvidaste tu contraseña?</span>
        </div>

        {/* BOTÓN */}
        <button className="login-btn" onClick={handleLogin}>
          Iniciar Sesión
        </button>

        <footer>2026 RadioSync v1.0</footer>

      </div>
    </div>
  );
}

export default LoginPersonal;