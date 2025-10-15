// src/App.jsx

import { API_URL } from './apiConfig'; 
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './Dashboard';
import JobDetailPage from './JobDetailPage';
import AddCustomerForm from './components/AddCustomerForm';
import AddJobForm from './components/AddJobForm';

// --- COMPONENTE PARA LA PÁGINA PRINCIPAL ---
// Muestra el tablero y los formularios de creación.
function MainPage({ jobs, customers, fetchAllData }) {
  return (
    <div className="App">
      <h1>AutoFlow</h1>
      <Dashboard jobs={jobs} customers={customers} />
      <hr />
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <AddCustomerForm onCustomerAdded={fetchAllData} />
        </div>
        <div style={{ flex: 2, minWidth: '400px' }}>
          <AddJobForm customers={customers} onJobAdded={fetchAllData} />
        </div>
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL DE LA APP ---
// Se encarga de obtener los datos y definir las rutas.
function App() {
  // --- ESTADOS ---
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);

  // --- LÓGICA PARA OBTENER DATOS ---
  const fetchAllData = async () => {
    try {
      const [jobsRes, customersRes] = await Promise.all([
        fetch(`${API_URL}/api/jobs`),
        fetch(`${API_URL}/api/customers`)
      ]);
      const jobsData = await jobsRes.json();
      const customersData = await customersRes.json();
      setJobs(jobsData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Se ejecuta una vez cuando la aplicación carga
  useEffect(() => {
    fetchAllData();
  }, []);

  // --- DEFINICIÓN DE RUTAS ---
  return (
    <Routes>
      {/* Ruta para la página principal */}
      <Route 
        path="/" 
        element={<MainPage jobs={jobs} customers={customers} fetchAllData={fetchAllData} />} 
      />
      {/* Ruta para la página de detalles de un trabajo específico */}
      <Route 
        path="/job/:jobId" 
        element={<JobDetailPage />} 
      />
    </Routes>
  );
}

export default App;