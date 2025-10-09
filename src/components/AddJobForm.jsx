import { useState } from 'react';

// We now accept a prop called onJobAdded
function AddJobForm({ onJobAdded }) {
  const [vehicle, setVehicle] = useState('');
  const [issue, setIssue] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newJob = { vehicle, issue, status: 'pending' };

    try {
      await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      setVehicle('');
      setIssue('');
      // After adding, we call the function from the parent to refresh the list!
      onJobAdded();

    } catch (error) {
      console.error('Error al añadir el trabajo:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Añadir Nuevo Trabajo</h3>
      <input
        type="text"
        placeholder="Vehículo (ej. Ford F-150 2021)"
        value={vehicle}
        onChange={(e) => setVehicle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Problema (ej. Vibración al frenar)"
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        required
      />
      <button type="submit">Añadir Trabajo</button>
    </form>
  );
}

export default AddJobForm;