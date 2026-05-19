import "./DashboardMedico.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function DashboardMedico() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]); 
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null); 
  const [estado, setEstado] = useState("pendiente");
  const [comentarios, setComentarios] = useState("");
  
  // 🟢 NUEVO: Estado para saber si es paciente o doctor
  const [esPaciente, setEsPaciente] = useState(false);

  // 1. CARGAR DATOS DESDE EL BACKEND
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const respuesta = await axios.get('http://127.0.0.1:8000/api/pacientes/', {
          headers: {
            Authorization: `Bearer ${token}` // Si el paciente no usa token, quítale esta validación en el backend o asegúrate de que el login de paciente le asigne uno
          }
        });
        
        // REVISAMOS QUIÉN ENTRÓ
        const rol = localStorage.getItem('rol');
        
        if (rol === 'paciente') {
          setEsPaciente(true);
          const miId = localStorage.getItem('mi_id_paciente');
          // Filtramos solo el expediente de este paciente
          const miExpediente = respuesta.data.find(p => p.id === miId);
          if (miExpediente) manejarSeleccionPaciente(miExpediente);
        } else {
          // Es Doctor: Carga todo normal
          setEsPaciente(false);
          setPacientes(respuesta.data);
          if (respuesta.data.length > 0) {
            manejarSeleccionPaciente(respuesta.data[0]);
          }
        }
      } catch (error) {
        console.error("Error cargando los datos:", error);
      }
    };

    cargarDatos();
  }, []);

  // 2. FUNCIÓN AL SELECCIONAR UN PACIENTE
  const manejarSeleccionPaciente = (pac) => {
    setPacienteSeleccionado(pac);
    setComentarios(pac.comentarios || "");
    
    if (pac.estatus === "En proceso") setEstado("proceso");
    else if (pac.estatus === "Realizado") setEstado("realizado");
    else setEstado("pendiente");
  };

  // 3. CICLO LOCAL DEL BOTÓN DE ESTADO (Semáforo)
  const cambiarEstado = () => {
    if (estado === "pendiente") setEstado("proceso");
    else if (estado === "proceso") setEstado("realizado");
    else setEstado("pendiente");
  };

  const obtenerTextoEstado = () => {
    if (estado === "pendiente") return "Pendiente por realizar";
    if (estado === "proceso") return "Estudio en proceso";
    return "Estudio realizado";
  };

  // 3.5 CERRAR SESIÓN LIMPIANDO TODO
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('rol'); 
    localStorage.removeItem('mi_id_paciente'); 
    navigate('/'); // Te avienta a la Landing Page
  };

  // 4. GUARDAR NOTAS Y ESTADO EN DJANGO
  const handleGuardarDiagnostico = async () => {
    if (!pacienteSeleccionado) {
      alert("Selecciona un paciente primero");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      let estatusBackend = "En espera";
      if (estado === "proceso") estatusBackend = "En proceso";
      if (estado === "realizado") estatusBackend = "Realizado";

      await axios.patch(`http://127.0.0.1:8000/api/pacientes/${pacienteSeleccionado.id}/`, {
        estatus: estatusBackend,
        comentarios: comentarios
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(`🩺 Diagnóstico guardado correctamente.`);
      
      setPacientes(pacientes.map(p => 
        p.id === pacienteSeleccionado.id 
          ? { ...p, estatus: estatusBackend, comentarios: comentarios } 
          : p
      ));

    } catch (error) {
      console.error("Error guardando diagnóstico:", error);
      alert("Error al guardar en BD.");
    }
  };

  return (
    <div className="medico-container">
      <div className="medico-overlay">
        
        {/* BOTÓN DE SALIR */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
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
              gap: '8px'
            }}
          >
            {esPaciente ? "🚪 Salir de mi Portal" : "🚪 Salir del sistema"}
          </button>
        </div>

        {/* 🟢 CONDICIONAL: SI NO ES PACIENTE, MUESTRA LA WORKLIST */}
        {!esPaciente && (
          <div className="input-box full" style={{ marginBottom: '25px' }}>
            <label style={{ color: '#bfc7d5', fontSize: '1.2rem', marginBottom: '10px' }}>
              LISTA DE TRABAJO MÉDICA (Worklist)
            </label>
            <select 
              onChange={(e) => {
                const encontrado = pacientes.find(p => p.id === e.target.value);
                if (encontrado) manejarSeleccionPaciente(encontrado);
              }}
              value={pacienteSeleccionado?.id || ""}
              style={{
                padding: '12px',
                background: 'rgba(15, 25, 50, 0.9)',
                color: 'white',
                border: '2px solid #16254b',
                borderRadius: '10px',
                fontSize: '1.1rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {pacientes.length === 0 && <option value="">No hay pacientes en la sala de espera</option>}
              {pacientes.map((p) => (
                <option key={p.id} value={p.id} style={{ background: '#0a1428' }}>
                  {p.id} - {p.nombre} ({p.tipo_estudio || p.estudio || 'Rayos X'})
                </option>
              ))}
            </select>
          </div>
        )}

        <h1 className="section-title">
          {esPaciente ? "MI EXPEDIENTE" : "FICHA DE IDENTIFICACIÓN"}
        </h1>

        <div className="info-card">
          <div className="top-name">
            <div className="input-box full">
              <label>Nombre Completo</label>
              <p>{pacienteSeleccionado?.nombre || "Cargando datos..."}</p>
            </div>
          </div>
          <div className="bottom-row">
            <div className="input-box">
              <label>Fecha de nacimiento</label>
              <p>{pacienteSeleccionado?.fecha_nacimiento || "Sin registro"}</p> 
            </div>

            <div className="input-box small">
              <label>Edad</label>
              <p>{pacienteSeleccionado?.edad || "--"}</p>
            </div>

            <div className="input-box small">
              <label>Sexo</label>
              <p>{pacienteSeleccionado?.sexo || "--"}</p>
            </div>
          </div>
        </div>

        <h1 className="section-title second-title">DATOS DEL ESTUDIO</h1>

        <div className="study-grid">
          <div className="left-side">
            <div className="input-box">
              <label>ID del paciente</label>
              <p>{pacienteSeleccionado?.id || "--"}</p>
            </div>
            <div className="input-box">
              <label>Estudio solicitado</label>
              <p>{pacienteSeleccionado?.tipo_estudio || pacienteSeleccionado?.estudio || "--"}</p>
            </div>
          </div>

          <div className="middle-side">
            <div className="input-box">
              <label>Fecha de Solicitud</label>
              <p>{new Date().toLocaleDateString()}</p>
            </div>

            <div className="estado-container">
              <label>Estado</label>
              <div className="estado-row">
                <div className={`estado-dot ${estado}`}></div>
                <span>{obtenerTextoEstado()}</span>
              </div>

              {/* 🟢 CONDICIONAL: SOLO EL DOCTOR PUEDE CAMBIAR EL SEMÁFORO */}
              {!esPaciente && (
                <button className="estado-btn" onClick={cambiarEstado}>
                  Cambiar Estado Visual
                </button>
              )}
            </div>
          </div>

          <div className="comments-side">
            <label>Dictamen e Interpretación Médica</label>
            {/* 🟢 CONDICIONAL: SI ES PACIENTE, LA CAJA ES READ-ONLY */}
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              readOnly={esPaciente}
              style={esPaciente ? { cursor: 'not-allowed', background: 'rgba(0,0,0,0.5)' } : {}}
              placeholder={esPaciente ? "El médico aún no ha agregado notas." : "Escribe aquí las observaciones..."}
            ></textarea>
            
            {/* 🟢 CONDICIONAL: SOLO EL DOCTOR VE EL BOTÓN DE GUARDAR */}
            {!esPaciente && (
              <button 
                className="estado-btn" 
                style={{ marginTop: '15px', background: '#2ecc71', color: 'black', width: '100%' }}
                onClick={handleGuardarDiagnostico}
              >
                💾 GUARDAR DIAGNÓSTICO EN EXPEDIENTE
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMedico;