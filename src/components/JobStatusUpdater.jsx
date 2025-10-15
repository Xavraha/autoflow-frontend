// src/components/JobStatusUpdater.jsx
import { API_URL } from '../apiConfig';
import { useState } from 'react';

const STATUSES = {
  pending_diagnosis: "Diagnóstico Pendiente",
  awaiting_parts: "En Espera de Piezas",
  in_progress: "En Progreso",
  completed: "Completado"
};

function JobStatusUpdater({ currentStatus, jobId, onStatusChange }) {
  const [status, setStatus] = useState(currentStatus);

  const handleUpdate = async (newStatus) => {
    try {
      await fetch(`${API_URL}/api/jobs${jobId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setStatus(newStatus);
      onStatusChange(newStatus); // Avisa al padre del cambio
      alert('¡Estado actualizado!');
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <label htmlFor="status-select" style={{ marginRight: '10px' }}>Estado del Trabajo:</label>
      <select 
        id="status-select"
        value={status} 
        onChange={(e) => handleUpdate(e.target.value)}
      >
        {Object.entries(STATUSES).map(([key, value]) => (
          <option key={key} value={key}>{value}</option>
        ))}
      </select>
    </div>
  );
}

export default JobStatusUpdater;