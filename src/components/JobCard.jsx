// src/components/JobCard.jsx
import { Link } from 'react-router-dom';

function JobCard({ job, customer }) {
  // Objeto para las clases CSS y colores de borde
  const statusClasses = {
    pending_diagnosis: 'pending_diagnosis',
    awaiting_parts: 'awaiting_parts',
    in_progress: 'in_progress',
    completed: 'completed',
    canceled: 'canceled' // Mantenemos el nuevo estado
  };
  const cardClass = statusClasses[job.status] || 'pending_diagnosis';

  return (
    // Enlace corregido para apuntar a /tasks/:id
    <Link to={`/tasks/${job._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className={`job-card ${cardClass}`}>
        <strong>{job.vehicleInfo.make} {job.vehicleInfo.model} ({job.vehicleInfo.year})</strong>
        <p>Cliente: {customer ? customer.name : 'N/A'}</p>
        <p>Tarea: {job.tasks.length > 0 ? job.tasks[0].title : 'Sin tareas'}</p>
      </div>
    </Link>
  );
}

export default JobCard;