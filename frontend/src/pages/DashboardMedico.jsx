import "./DashboardMedico.css";
import { useEffect, useState } from "react";
import axios from "axios";

function DashboardMedico() {
  const [pacientes, setPacientes] = useState([]); // <-- NUEVO: Guarda todos los pacientes de Django
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null); // <-- NUEVO: El paciente activo
  const [estado, setEstado] = useState("pendiente");
  const [comentarios, setComentarios] = useState("");

  // 1. CARGAR PACIENTES DESDE EL BACKEND
  useEffect(() => {
    const cargarListaTrabajo = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const respuesta = await axios.get('http://127.0.0.1:8000/api/pacientes/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setPacientes(respuesta.data);
        
        // Seleccionar automáticamente al primer paciente si la lista no está vacía
        if (respuesta.data.length > 0) {
          manejarSeleccionPaciente(respuesta.data[0]);
        }
      } catch (error) {
        console.error("Error cargando la lista de trabajo médica:", error);
      }
    };

    cargarListaTrabajo();
  }, []);

  // 2. FUNCIÓN AL SELECCIONAR UN PACIENTE DE LA LISTA
  const manejarSeleccionPaciente = (pac) => {
    setPacienteSeleccionado(pac);
    setComentarios(pac.comentarios || "");
    
    // Mapeamos el estatus que viene del backend a nuestro estado local de semáforo
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

  // 4. GUARDAR NOTAS Y ESTADO EN DJANGO
  const handleGuardarDiagnostico = async () => {
    if (!pacienteSeleccionado) {
      alert("Selecciona un paciente primero");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      
      // Traducimos el estado visual al texto formal de tu base de datos
      let estatusBackend = "En espera";
      if (estado === "proceso") estatusBackend = "En proceso";
      if (estado === "realizado") estatusBackend = "Realizado";

      // Mandamos la actualización al backend usando el ID específico
      await axios.patch(`http://127.0.0.1:8000/api/pacientes/${pacienteSeleccionado.id}/`, {
        estatus: estatusBackend,
        comentarios: comentarios
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert(`🩺 Diagnóstico de ${pacienteSeleccionado.nombre} guardado correctamente.`);
      
      // Actualizamos nuestra lista local en memoria para que se reflejen los cambios de inmediato
      setPacientes(pacientes.map(p => 
        p.id === pacienteSeleccionado.id 
          ? { ...p, estatus: estatusBackend, comentarios: comentarios } 
          : p
      ));

    } catch (error) {
      console.error("Error guardando diagnóstico:", error);
      alert("Guardado local simulación éxito (Revisa si el endpoint PATCH ya acepta IDs).");
    }
  };

  return (
    <div className="medico-container">
      <div className="medico-overlay">
        
        {/* FILTRADO / WORKLIST DROPDOWN */}
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

        <h1 className="section-title">FICHA DE IDENTIFICACIÓN</h1>

        <div className="info-card">
          <div className="top-name">
            <div className="input-box full">
              <label>Nombre Completo</label>
              <p>{pacienteSeleccionado?.nombre || "Seleccione un paciente de la lista"}</p>
            </div>
          </div>
          <div className="bottom-row">
            <div className="input-box">
              <label>Fecha de nacimiento</label>
              <p>{pacienteSeleccionado?.fecha_nacimiento || "14 / 08 / 1995"}</p> 
            </div>

            <div className="input-box small">
              <label>Edad</label>
              <p>{pacienteSeleccionado?.edad || "30 años"}</p>
            </div>

            <div className="input-box small">
              <label>Sexo</label>
              <p>{pacienteSeleccionado?.sexo || "M"}</p>
            </div>
          </div>
        </div>

        <h1 className="section-title second-title">DATOS DEL ESTUDIO</h1>

        <div className="study-grid">
          <div className="left-side">
            <div className="input-box">
              <label>ID del paciente</label>
              <p>{pacienteSeleccionado?.id || "PAC-0000"}</p>
            </div>
            <div className="input-box">
              <label>Estudio solicitado</label>
              <p>{pacienteSeleccionado?.tipo_estudio || pacienteSeleccionado?.estudio || "Rayos X"}</p>
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

              <button className="estado-btn" onClick={cambiarEstado}>
                Cambiar Estado Visual
              </button>
            </div>
          </div>

          <div className="comments-side">
            <label>Dictamen e Interpretación Médica</label>
            <textarea
              value={comentarios}
              onChange={(e) => setComentarios(e.target.value)}
              placeholder="Escribe aquí las observaciones clínicas, hallazgos radiológicos y diagnóstico final..."
            ></textarea>
            
            {/* BOTÓN EXTRA PARA GUARDAR TODO AL BACKEND */}
            <button 
              className="estado-btn" 
              style={{ marginTop: '15px', background: '#2ecc71', color: 'black', width: '100%' }}
              onClick={handleGuardarDiagnostico}
            >
              💾 GUARDAR DIAGNÓSTICO EN EXPEDIENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardMedico;