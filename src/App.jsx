// src/App.jsx

import { useState, useEffect } from 'react';
import JobList from './components/JobList';
import AddJobForm from './components/AddJobForm';
import AddCustomerForm from './components/AddCustomerForm';

function App() {
  // --- ESTADOS ---
  // Almacenes para guardar los datos que vienen del backend
  const [jobs, setJobs] = useState([]);
  const [customers, setCustomers] = useState([]);

  // --- FUNCIONES PARA COMUNICARSE CON EL BACKEND ---

  // Función para obtener TODOS los trabajos
  const fetchJobs = async () => {
    try {
      console.log("Intentando obtener trabajos...");
      const response = await fetch('http://localhost:3000/api/jobs');
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  // Función para obtener TODOS los clientes
  const fetchCustomers = async () => {
    try {
      console.log("Intentando obtener clientes...");
      const response = await fetch('http://localhost:3000/api/customers');
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  // --- EL INTERRUPTOR DE ENCENDIDO ---
  // Esto se ejecuta UNA SOLA VEZ cuando la aplicación carga por primera vez
  useEffect(() => {
    fetchJobs();
    fetchCustomers();
  }, []); // El array vacío [] asegura que solo se ejecute una vez

  return (
    <div>
      <h1>AutoFlow App</h1>
      
      <AddCustomerForm onCustomerAdded={fetchCustomers} />
      <hr />
      
      <AddJobForm customers={customers} onJobAdded={fetchJobs} />
      <hr />
      
      <JobList jobs={jobs} customers={customers} onJobDeleted={fetchJobs} />
    </div>
  );
}

export default App;