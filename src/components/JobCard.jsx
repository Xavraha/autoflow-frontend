// src/components/JobCard.jsx
import { Link } from 'react-router-dom'; // 1. Importar Link

function JobCard({ job, customer }) {
  const statusClasses = { /* ... (sin cambios) ... */ };
  const cardClass = statusClasses[job.status] || 'pending_diagnosis';

  return (
    // 2. Envolver todo en un componente Link
    <Link to={`/job/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`job-card ${cardClass}`}>
        <strong>{job.vehicleInfo.make} {job.vehicleInfo.model} ({job.vehicleInfo.year})</strong>
        <p>Cliente: {customer ? customer.name : 'N/A'}</p>
        <p>Tarea: {job.tasks.length > 0 ? job.tasks[0].title : 'Sin tareas'}</p>
      </div>
    </Link>
  );
}

export default JobCard;