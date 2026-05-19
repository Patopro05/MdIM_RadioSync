import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './DashboardTecnico.css';

export default function DashboardTecnico() {
  const [pacientes, setPacientes] = useState([]);
  const navigate = useNavigate();

  // FORM STATES
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

  // 1. CARGA INICIAL DE PACIENTES
  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const respuesta = await axios.get('http://127.0.0.1:8000/api/pacientes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPacientes(respuesta.data);
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    };
    cargarPacientes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('paciente');
    navigate('/personal');
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      const datosAEnviar = {
        nombre,
        comentarios,
        fecha_nacimiento: fechaNacimiento,
        sexo,
        peso_kg: peso,
        estatura_cm: estatura,
        tipo_estudio: estudio,
        fecha_estudio: fechaEstudio,
        hora_estudio: horaEstudio
      };

      const respuesta = await axios.post(
        'http://127.0.0.1:8000/api/pacientes/',
        datosAEnviar,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizamos la lista con la respuesta fresca del server
      const resLista = await axios.get('http://127.0.0.1:8000/api/pacientes/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPacientes(resLista.data);

      setQrGenerado(respuesta.data.id);
      
      navigate('/qr-generado', {
        state: {
          qr: respuesta.data.qr_url,
          nombre: respuesta.data.nombre,
          id: respuesta.data.id,
          estudio: respuesta.data.tipo_estudio
        }
      });

      // Reset Form
      setNombre(''); setComentarios(''); setFechaNacimiento(''); setSexo('');
      setPeso(''); setEstatura(''); setEstudio(''); setFechaEstudio(''); setHoraEstudio('');

    } catch (error) {
      console.error(error);
      alert('No se pudo registrar');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-overlay">

        {/* --- PANEL IZQUIERDO: SALA DE ESPERA --- */}
        <div className="waiting-room">
          
          {/* HEADER DE LA TABLA: Título y Botón de Salir juntos */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '15px' 
          }}>
            <h1 style={{ margin: 0, fontSize: '1.2rem' }}>SALA DE ESPERA</h1>
            
            <button 
              onClick={handleLogout} 
              style={{ 
                background: '#e40000', 
                color: 'white', 
                border: 'none', 
                padding: '6px 12px', 
                borderRadius: '6px', 
                cursor: 'pointer', 
                fontWeight: 'bold',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              Salir
            </button>
          </div>

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
                      className="register-btn"
                      style={{ padding: '4px 8px', fontSize: '11px', marginTop: 0 }}
                      onClick={() => navigate('/qr-generado', {
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

        {/* --- PANEL DERECHO: FORMULARIO --- */}
        <div className="patient-form">
          <h1>DATOS DEL PACIENTE</h1>
          
          <form onSubmit={handleRegistro}>
            <div className="input-box">
              <label>Nombre completo</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              <span>*Obligatorio</span>
            </div>

            <div className="input-box">
              <label>Comentarios</label>
              <input type="text" value={comentarios} onChange={(e) => setComentarios(e.target.value)} />
            </div>

            <div className="row">
              <div className="input-box">
                <label>Fecha de Nacimiento</label>
                <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
              </div>
              <div className="input-box">
                <label>Sexo</label>
                <select value={sexo} onChange={(e) => setSexo(e.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                  <option value="O">Otro</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="input-box">
                <label>Peso (kg)</label>
                <input type="number" step="0.1" value={peso} onChange={(e) => setPeso(e.target.value)} required />
              </div>
              <div className="input-box">
                <label>Estatura (cm)</label>
                <input type="number" step="0.1" value={estatura} onChange={(e) => setEstatura(e.target.value)} required />
              </div>
            </div>

            <div className="row">
              <div className="input-box">
                <label>Estudio</label>
                <select value={estudio} onChange={(e) => setEstudio(e.target.value)}>
                  <option value="">Seleccione</option>
                  <option value="Rayos X">Rayos X</option>
                  <option value="Tomografía">Tomografía</option>
                  <option value="Resonancia">Resonancia</option>
                </select>
              </div>

              <div className="input-box">
                <label>Fecha y Hora</label>
                <div className="datetime">
                  <input type="date" value={fechaEstudio} onChange={(e) => setFechaEstudio(e.target.value)} />
                  <input type="time" value={horaEstudio} onChange={(e) => setHoraEstudio(e.target.value)} />
                </div>
              </div>
            </div>

            <button type="submit" className="register-btn">
              REGISTRAR Y GENERAR QR
            </button>
          </form>

          {qrGenerado && (
            <div className="qr-box">
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <h3 style={{ fontSize: '14px', margin: 0 }}>QR LISTO:</h3>
                <div className="fake-qr" style={{ width: '60px', height: '60px', fontSize: '0.8rem' }}>
                  {qrGenerado}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}