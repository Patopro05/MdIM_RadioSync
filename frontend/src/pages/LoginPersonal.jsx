import './Login.css';
import { useState } from 'react';

function Login() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log("Usuario:", usuario);
    console.log("Contraseña:", password);

    // Aquí luego conectarás con backend
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

export default Login;