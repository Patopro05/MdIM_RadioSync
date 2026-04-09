import { useState, useEffect } from 'react';
import { QrCode, UserPlus, Clock } from 'lucide-react';
import axios from 'axios';

export default function DashboardTecnico() {
  const [pacientes, setPacientes] = useState([]);
  
  // Estados para el formulario de biometría
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [sexo, setSexo] = useState('M');
  const [peso, setPeso] = useState('');
  const [estatura, setEstatura] = useState('');
  const [estudio, setEstudio] = useState('');
  
  const [qrGenerado, setQrGenerado] = useState(null);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        const token = localStorage.getItem('access_token'); 
        const respuesta = await axios.get('http://127.0.0.1:8000/api/pacientes/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPacientes(respuesta.data); 
      } catch (error) {
        console.error("Error al traer la BD:", error);
      }
    };
    cargarPacientes();
  }, []);

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      
      // Armamos el paquete exactamente como Django lo pide
      const datosAEnviar = {
        nombre: nombre,
        fecha_nacimiento: fechaNacimiento,
        sexo: sexo,
        peso_kg: peso,
        estatura_cm: estatura,
        tipo_estudio: estudio
      };

      const respuesta = await axios.post('http://127.0.0.1:8000/api/pacientes/', datosAEnviar, {
        headers: { 
    Authorization: `Bearer ${token}` // ¡Ojo al espacio después de Bearer!
            }
        });

      setPacientes([...pacientes, respuesta.data]);
      setQrGenerado(respuesta.data.id);
      
      // Limpiamos todo
      setNombre(''); setFechaNacimiento(''); setPeso(''); setEstatura(''); setEstudio('');
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error.message);
      alert("No se pudo registrar. Revisa la consola.");
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
        <h1 style={{ color: '#2c3e50', display: 'flex', alignItems: 'center', gap: '10px' }}><UserPlus size={32} /> Recepción Radiológica</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        
        {/* FORMULARIO */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#34495e' }}>Nuevo Registro</h2>
          
          <form onSubmit={handleRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            
            <label style={{ fontSize: '0.8rem', color: 'gray' }}>Fecha de Nacimiento</label>
            <input type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }} />
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <select value={sexo} onChange={(e) => setSexo(e.target.value)} style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }}>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="number" step="0.1" placeholder="Peso (kg)" value={peso} onChange={(e) => setPeso(e.target.value)} required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
              <input type="number" placeholder="Estatura (cm)" value={estatura} onChange={(e) => setEstatura(e.target.value)} required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', flex: 1 }} />
            </div>

            <select value={estudio} onChange={(e) => setEstudio(e.target.value)} required style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}>
              <option value="" disabled>Selecciona estudio...</option>
              <option value="Rayos X - Tórax">Rayos X - Tórax</option>
              <option value="Resonancia">Resonancia</option>
            </select>

            <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', padding: '12px', marginTop: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Registrar y Generar QR
            </button>
          </form>

          {/* ÁREA DEL QR */}
          {qrGenerado && (
            <div style={{ marginTop: '20px', textAlign: 'center', padding: '15px', backgroundColor: '#fdfefe', border: '2px dashed #bdc3c7', borderRadius: '10px' }}>
              <QrCode size={48} color="#2c3e50" style={{ margin: '0 auto' }} />
              <h3 style={{ margin: '10px 0 5px 0', color: '#27ae60' }}>{qrGenerado}</h3>
            </div>
          )}
        </div>

        {/* TABLA DE SALA DE ESPERA (Se mantiene igual) */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#34495e', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={24} /> Sala de Espera
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#ecf0f1', color: '#2c3e50' }}>
                <th style={{ padding: '12px' }}>ID / QR</th>
                <th style={{ padding: '12px' }}>Paciente</th>
                <th style={{ padding: '12px' }}>Estudio</th>
                <th style={{ padding: '12px' }}>Estatus</th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ecf0f1' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: '#7f8c8d' }}>{paciente.id}</td>
                  <td style={{ padding: '12px' }}>{paciente.nombre}</td>
                  <td style={{ padding: '12px' }}>{paciente.estudio}</td>
                  <td style={{ padding: '12px' }}><span style={{ backgroundColor: '#f1c40f', padding: '5px 10px', borderRadius: '20px', fontSize: '0.85rem' }}>{paciente.estatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}