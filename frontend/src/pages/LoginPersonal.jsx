import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();

    console.log("Intentando usuario:", usuario);
    
    try {
      const respuesta = await axios.post('http://127.0.0.1:8000/api/token/', {
        username: usuario,
        password: password
      });

      console.log("Acceso garantizado", respuesta.data);
      localStorage.setItem('access_token', respuesta.data.access);
      localStorage.setItem('refresh_token', respuesta.data.refresh);

      navigate('/medico');
    } catch(error) {
      console.error("Error de inicio:", error);
      alert("Usuario o contraseña incorrectos.");
    }
  };   

  return (
    <div className="container">

      <div className="overlay">

        <h1>Iniciar Sesión</h1>

        <div className="input-group">
          <div className="icon-loguser"></div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="input-group">
          <div className="icon-logpasword"></div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          Iniciar Sesión
        </button>

        <footer>2026 RadioSync v1.0</footer>

      </div>
    </div>
  );
}