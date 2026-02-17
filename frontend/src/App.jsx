import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Estados para guardar la respuesta del servidor
  const [serverStatus, setServerStatus] = useState("Conectando...");
  const [statusColor, setStatusColor] = useState("text-yellow-500");

  useEffect(() => {
    // Esta función se ejecuta automáticamente al cargar la página
    fetch('http://127.0.0.1:8000/api/status/')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la red');
        }
        return response.json();
      })
      .then(data => {
        // Si Django responde:
        setServerStatus("En Línea 🟢");
        setStatusColor("text-green-500");
        console.log("Django dice:", data.message);
      })
      .catch(error => {
        // Si falla la conexión:
        setServerStatus("Desconectado 🔴");
        setStatusColor("text-red-500");
        console.error("Error conectando:", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center font-sans">
      {/* Encabezado */}
      <header className="bg-blue-900 w-full p-6 text-white text-center shadow-md">
        <h1 className="text-3xl font-bold">RadioSync</h1>
        <p className="text-sm opacity-80">Ecosistema Digital Integral de Radiología</p>
      </header>

      {/* Contenido Principal */}
      <main className="flex flex-col items-center mt-10 p-8 bg-white rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl text-gray-800 font-semibold mb-6">
          Panel de Acceso
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow transition transform hover:-translate-y-1">
            Soy Radiólogo 🩺
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow transition transform hover:-translate-y-1">
            Soy Técnico ☢️
          </button>
        </div>

        {/* Indicador de Estado - AQUÍ OCURRE LA MAGIA */}
        <div className="mt-4 p-3 bg-gray-50 rounded-full border border-gray-200">
          <p className="text-gray-600 text-sm font-medium">
            Estado del Servidor: <span className={`font-bold ${statusColor}`}>{serverStatus}</span>
          </p>
        </div>
      </main>
      
      <footer className="mt-auto py-6 text-gray-400 text-xs">
        © 2026 RadioSync v1.0 - On-Premise Solution
      </footer>
    </div>
  );
}

export default App