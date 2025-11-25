// src/App.jsx

import { API_URL } from './apiConfig';
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Layout & Components
import Layout from './components/Layout';
import Dashboard from './Dashboard'; // New Dashboard (Stats)
import KanbanBoard from './KanbanBoard'; // Old Dashboard (Tasks)
import JobDetailPage from './JobDetailPage';
import AddCustomerForm from './components/AddCustomerForm';
import AddJobForm from './components/AddJobForm';
import ClientList from './pages/ClientList';
import ClientForm from './pages/ClientForm';
import TechnicianList from './pages/TechnicianList';
import TechnicianForm from './pages/TechnicianForm';
import TechnicianProfile from './pages/TechnicianProfile';
import NewTask from './pages/NewTask';
import TaskDetail from './pages/TaskDetail';

// Placeholder components for new routes (will be implemented in next phases)
const TechniciansPage = () => <div><h2>Técnicos (En construcción)</h2></div>;
const NewTaskPage = ({ customers, fetchAllData }) => (
  <div style={{ padding: '20px' }}>
    <h2>Nueva Tarea</h2>
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
        <Route path="/tasks" element={<KanbanBoard jobs={jobs} customers={customers} />} />
        <Route path="/tasks/new" element={<NewTask />} />
        <Route path="/tasks/:id" element={<TaskDetail />} />

        {/* Técnicos */}
        <Route path="/technicians" element={<TechnicianList />} />
        <Route path="/technicians/new" element={<TechnicianForm />} />
        <Route path="/technicians/edit/:id" element={<TechnicianForm />} />
        <Route path="/technicians/:id" element={<TechnicianProfile />} />

        {/* Detalle de Trabajo */}
        <Route path="/job/:jobId" element={<JobDetailPage />} />
      </Routes>
    </Layout>
  );
}

export default App;