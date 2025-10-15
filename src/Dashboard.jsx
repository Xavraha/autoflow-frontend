// src/Dashboard.jsx
import './Dashboard.css';
import JobCard from './components/JobCard';

// Definimos las columnas, incluyendo la nueva
const STATUSES = {
  pending_diagnosis: "Diagnóstico Pendiente",
  awaiting_parts: "En Espera de Piezas",
  in_progress: "En Progreso",
  completed: "Completado",
  canceled: "Cancelado"
};

function Dashboard({ jobs, customers }) {
  // Agrupamos los trabajos por su estado actual
  const jobsByStatus = jobs.reduce((acc, job) => {
    const status = job.status || 'pending_diagnosis';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(job);
    return acc;
  }, {});

  return (
    <div>
      <h2>Torre de Control</h2>
      <div className="dashboard-container">
        {Object.keys(STATUSES).map(statusKey => (
          <div key={statusKey} className="status-column">
            <h3 className="column-title">{STATUSES[statusKey]}</h3>
            <div className="job-cards-container">
              {/* Mostramos las tarjetas que corresponden a esta columna */}
              {(jobsByStatus[statusKey] || []).map(job => {
                const customer = customers.find(c => c._id === job.customerId);
                return <JobCard key={job._id} job={job} customer={customer} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;