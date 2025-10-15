// src/components/AddStepForm.jsx
import { API_URL } from './apiConfig';
import { useState } from 'react';

function AddStepForm({ jobId, taskId, onStepAdded }) {
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description) {
      alert('Por favor, escribe la descripción del paso.');
      return;
    }

    try {
      await fetch(`${API_URL}/api/jobs/${jobId}/tasks/${taskId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });

      setDescription(''); // Limpiamos el input
      onStepAdded(); // Refrescamos la lista de trabajos para ver el nuevo paso
    } catch (error) {
      console.error('Error al añadir el paso:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '10px 0 10px 20px' }}>
      <input
        type="text"
        placeholder="Añadir nuevo paso..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginRight: '5px' }}
      />
      <button type="submit">Añadir Paso</button>
    </form>
  );
}

export default AddStepForm;