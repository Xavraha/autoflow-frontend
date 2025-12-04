// src/KanbanBoard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';
import './KanbanBoard.css';
import JobCard from './components/JobCard';

// Definimos las columnas
const STATUSES = {
  pending_diagnosis: "DIAGNÓSTICO PENDIENTE",
  awaiting_parts: "EN ESPERA DE PIEZAS",
  in_progress: "EN PROGRESO",
  completed: "COMPLETADO",
  canceled: "CANCELADO"
};

const STATUS_COLORS = {
  pending_diagnosis: "#f0ad4e",
  awaiting_parts: "#d9534f",
  in_progress: "#00f3ff",
  completed: "#5cb85c",
  canceled: "#6c757d"
};

function KanbanBoard({ jobs, customers, refreshJobs, loading }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    vehiclesInShop: 0,
    criticalTasks: 0,
    efficiency: 0
  });

  // Recargar datos al montar el componente para sincronizar cambios de TaskDetail
  useEffect(() => {
    if (refreshJobs) {
      refreshJobs();
    }
  }, []); // Se ejecuta solo al montar

  useEffect(() => {
    // Calculate stats
    const inProgress = jobs.filter(j => j.status === 'in_progress' || j.status === 'awaiting_parts').length;
    const critical = jobs.filter(j => j.status === 'awaiting_parts').length;
    const completed = jobs.filter(j => j.status === 'completed').length;
    const efficiency = jobs.length > 0 ? Math.round((completed / jobs.length) * 100) : 0;

    setStats({
      vehiclesInShop: inProgress,
      criticalTasks: critical,
      efficiency: efficiency
    });
  }, [jobs]);

  // Agrupamos los trabajos por su estado actual
  const jobsByStatus = jobs.reduce((acc, job) => {
    const status = job.status || 'pending_diagnosis';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(job);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-screen">LOADING TASKS DATA...</div>;
  }

  return (
    <div className="kanban-view">
      {/* Stats Header */}
      <div className="stats-header">
        <div className="stat-card vehicles">
          <FaCar className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">VENÍCULO EN TALLER:</span>
            <span className="stat-value">{stats.vehiclesInShop}</span>
          </div>
        </div>
        <div className="stat-card critical">
          <FaExclamationTriangle className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">TAREAS CRÍTICAS:</span>
            <span className="stat-value">{stats.criticalTasks}</span>
          </div>
        </div>
        <div className="stat-card efficiency">
          <FaChartLine className="stat-icon" />
          <div className="stat-content">
            <span className="stat-label">EFICIENCIA TÉCNICA:</span>
            <span className="stat-value">{stats.efficiency}%</span>
          </div>
        </div>
      </div>

      {/* Title and Actions */}
      <div className="kanban-header">
        <h2 className="kanban-title">TAREAS <span className="subtitle">(Analytics)</span></h2>
        <button className="add-task-btn" onClick={() => navigate('/tasks/new')}>
          AÑADIR TAREA
        </button>
      </div>

      {/* Kanban Board */}
      <div className="dashboard-container">
        {Object.keys(STATUSES).map(statusKey => (
          <div key={statusKey} className={`status-column ${statusKey}`}>
            <div className="column-header">
              <h3 className="column-title">{STATUSES[statusKey]}</h3>
              <span className="task-count">{(jobsByStatus[statusKey] || []).length} TAREAS</span>
            </div>
            <div className="job-cards-container">
              {(jobsByStatus[statusKey] || []).map(job => {
                const customer = customers.find(c => c._id === job.customerId);
                return <JobCard key={job._id} job={job} customer={customer} />;
              })}
            </div>
            <div className="column-glow" style={{ background: STATUS_COLORS[statusKey] }}></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KanbanBoard;