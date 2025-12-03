// src/App.jsx

import { API_URL } from './apiConfig';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout & Components
import Layout from './components/Layout';
import Dashboard from './Dashboard'; // New Dashboard (Stats)
import KanbanBoard from './KanbanBoard'; // Old Dashboard (Tasks)
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import TechnicianList from './pages/TechnicianList';
import TechnicianForm from './pages/TechnicianForm';
import TechnicianProfile from './pages/TechnicianProfile';
import NewTask from './pages/NewTask';
import TaskDetail from './pages/TaskDetail';




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
    <Layout>
      <Routes>
        {/* Dashboard Principal (Stats) */}
        <Route path="/" element={<Dashboard />} />

        {/* Clientes */}
        <Route path="/clients" element={<ClientList />} />
        <Route path="/clients/new" element={<ClientForm />} />
        <Route path="/clients/edit/:id" element={<ClientForm />} />

        {/* Nueva Tarea - usando el componente correcto */}
        <Route path="/new-task" element={<NewTask />} />

        {/* Tareas (Kanban) */}
        <Route path="/tasks" element={<KanbanBoard jobs={jobs} customers={customers} refreshJobs={fetchAllData} />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />

        {/* Técnicos */}
        <Route path="/technicians" element={<TechnicianList />} />
        <Route path="/technicians/new" element={<TechnicianForm />} />
        <Route path="/technicians/edit/:id" element={<TechnicianForm />} />
        <Route path="/technicians/:id" element={<TechnicianProfile />} />
      </Routes>
    </Layout>
  );
}

export default App;