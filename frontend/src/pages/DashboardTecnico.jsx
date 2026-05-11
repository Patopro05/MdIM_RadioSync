import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './DashboardTecnico.css';

export default function DashboardTecnico() {

  const [pacientes, setPacientes] = useState([]);

  // FORM
  const [nombre, setNombre] = useState('');
  const [comentarios, setComentarios] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('');
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

        setPacientes(respuesta.data);

      } catch (error) {
        console.error(error);
      }
    };

    cargarPacientes();

  }, []);

  const handleRegistro = async (e) => {

    e.preventDefault();

    try {

      const token = localStorage.getItem('access_token');

      const datosAEnviar = {
        nombre: nombre,
        comentarios: comentarios,
        fecha_nacimiento: fechaNacimiento,
        sexo: sexo,
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
      
      const navigate = useNavigate();

      navigate('/qr-generados', {
            state: {
              qr: respuesta.data.qr_url,
              nombre: respuesta.data.nombre,
              id: respuesta.data.id,
              estudio: respuesta.data.estudio
            }

          });

      // LIMPIAR FORM
      setNombre('');
      setComentarios('');
      setFechaNacimiento('');
      setSexo('');
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

        <div className="waiting-room">

          <h1>SALA DE ESPERA</h1>

          <table>

            <thead>
              <tr>
                <th>ID/QR</th>
                <th>NOMBRE</th>
                <th>ESTUDIO</th>
                <th>HORARIO</th>
              </tr>
            </thead>

            <tbody>

              {pacientes.map((paciente, index) => (

                <tr key={index}>
                  <td>{paciente.id}</td>
                  <td>{paciente.nombre}</td>
                  <td>{paciente.tipo_estudio}</td>
                  <td>{paciente.hora_estudio}</td>
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

              <span>*Obligatorio</span>

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