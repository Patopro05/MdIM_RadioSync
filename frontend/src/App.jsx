import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import LoginPersonal from "./pages/LoginPersonal";
import LoginPaciente from "./pages/LoginPaciente";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/personal" element={<LoginPersonal />} />
        <Route path="/paciente" element={<LoginPaciente />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;