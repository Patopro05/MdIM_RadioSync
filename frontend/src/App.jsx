import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import LoginPersonal from "./pages/LoginPersonal";
import LoginPaciente from "./pages/LoginPaciente";
import DashboardMedico from "./pages/DashboardMedico";
import DashboardTecnico from "./pages/DashboardTecnico";
import QRSuccess from './pages/QRSuccess';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal" element={<LoginPersonal />} />
        
        <Route path="/paciente" element={<LoginPaciente />} />
                
        <Route path="/medico" element={<DashboardMedico />} />
        <Route path="/tecnico" element={<DashboardTecnico />} />
        <Route path="/qr-generado" element={<QRSuccess />} />
        
        <Route path="*" element={<h1 style={{textAlign: 'center', marginTop: '50px'}}>Error 404: Esta página no existe todavía, síguelo revisando</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;