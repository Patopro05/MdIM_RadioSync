import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './DashboardTecnico.css';

export default function DashboardTecnico() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  // FORM
  const [nombre, setNombre] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [estudio, setEstudio] = useState('');
  const [fechaEstudio, setFechaEstudio] = useState('');
  const [horaEstudio, setHoraEstudio] = useState('');

  const [qrGenerado, setQrGenerado] = useState(null);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const respuesta = await axios.get(
          'http://127.0.0.1:8000/api/pacientes/',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const resListaFresca = await axios.get('http://127.0.0.1:8000/api/pacientes/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPacientes(resListaFresca.data);

        setPacientes(respuesta.data);
      } catch (error) {
        console.error(error);
      }
    };
    cargarPacientes();
  }, []);

  // FUNCIÓN PARA SALIR DEL SISTEMA
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('paciente');
    navigate('/personal'); // Ajusta esto si tu login está en '/'
  };

  const handleRegistro = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('access_token');

      const datosAEnviar = {
        nombre: nombre,
        comentarios: comentarios,
        fecha_nacimiento: fechaNacimiento,
        sexo: sexo,
        peso_kg: peso,
        estatura_cm: estatura,
        tipo_estudio: estudio,
        fecha_estudio: fechaEstudio,
        hora_estudio: horaEstudio
      };

      const respuesta = await axios.post(
        'http://127.0.0.1:8000/api/pacientes/',
        datosAEnviar,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPacientes([...pacientes, respuesta.data]);
      setQrGenerado(respuesta.data.id);
      
      // NAVEGACIÓN CORREGIDA AL QR
      navigate('/qr-generado', {
            state: {
              qr: respuesta.data.qr_url,
              nombre: respuesta.data.nombre,
              id: respuesta.data.id,
              estudio: respuesta.data.tipo_estudio // <--- ¡AQUÍ ESTABA EL DETALLE!
            }
          });

      // LIMPIAR FORM
      setNombre('');
      setComentarios('');
      setFechaNacimiento('');
      setSexo('');
      setPeso('');
      setEstatura('');
      setEstudio('');
      setFechaEstudio('');
      setHoraEstudio('');

    } catch (error) {
      console.error(error);
      alert('No se pudo registrar');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay">

        {/* BOTÓN DE SALIR */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '15px' }}>
          <button 
            onClick={handleLogout} 
            style={{ 
              background: '#e40000', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              width: 'max-content', 
              height: 'fit-content',
              gap: '8px'
            }}
          >
            Salir de recepción
          </button>
        </div>

        <div className="waiting-room">
          <h1>SALA DE ESPERA</h1>
          <table>
            <thead>
              <tr>
                <th>ID/QR</th>
                <th>NOMBRE</th>
                <th>ESTUDIO</th>
                <th>HORARIO</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr key={index}>
                  <td>{paciente.id}</td>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.tipo_estudio}</td>
                  <td>{paciente.hora_estudio}</td>
                  <td>
                    <button
                    className = "register-btn"
                    style = {{padding: '5px 10px', fontSize: '10px'}}
                    onClick = {() => navigate('/qr-generado', {
                       state: {
                         qr: paciente.qr_url, 
                         nombre: paciente.nombre,
                         id: paciente.id,
                         estudio: paciente.tipo_estudio
                       }
                      })}
                    >
                      Ver QR
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FORMULARIO */}
        <div className="patient-form">
          <h1>DATOS DEL PACIENTE</h1>
          <form onSubmit={handleRegistro}>
            {/* NOMBRE */}
            <div className="input-box">
              <label>Nombre completo</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
              <span>*Obligatorio</span>
            </div>

            <div className="input-box">
              <label>Comentarios</label>
              <input
                type="text"
                value={comentarios}
                onChange={(e) => setComentarios(e.target.value)}
              />
            </div>

            <div className="row">
              <div className="input-box">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                />
              </div>
              <div className="input-box">
                <label>Sexo</label>
                <select 
                  value={sexo}
                  onChange={(e) => setSexo(e.target.value)}
                >
                  <option className="option-list" value="">Seleccione</option>
                  <option className="option-list" value="M">Masculino</option>
                  <option className="option-list"  value="F">Femenino</option>
                  <option className="option-list" value="O">Otro</option>
                </select>
              </div>
            </div>

           <div className="row">
              <div className="input-box">
                <label>Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required
                />
              </div>
            <div className="input-box">
                <label>Estatura (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={estatura}
                  onChange={(e) => setEstatura(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="input-box">
                <label>Estudio</label>
                <select
                  value={estudio}
                  onChange={(e) => setEstudio(e.target.value)}
                >
                  <option className="option-list" value="">Seleccione</option>
                  <option className="option-list" value="Rayos X">Rayos X</option>
                  <option className="option-list" value="Tomografía">Tomografía</option>
                  <option className="option-list" value="Resonancia">Resonancia</option>
                </select>
              </div>

              <div className="input-box">
                <label>Fecha y Hora</label>
                <div className="datetime">
                  <input
                    type="date"
                    value={fechaEstudio}
                    onChange={(e) => setFechaEstudio(e.target.value)}
                  />
                  <input
                    type="time"
                    value={horaEstudio}
                    onChange={(e) => setHoraEstudio(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* BOTON */}
            <button type="submit" className="register-btn">
              REGISTRAR Y GENERAR QR
            </button>
          </form>

          {/* QR */}
          {qrGenerado && (
            <div className="qr-box">
              <h3>QR GENERADO</h3>
              <div className="fake-qr">
                {qrGenerado}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}