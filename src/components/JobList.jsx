// src/components/JobList.jsx
import Step from './Step';
import AddStepForm from './AddStepForm';

function JobList({ jobs, customers, onJobDeleted }) {
  const handleDelete = async (jobId) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este trabajo?')) {
      try {
        await fetch(`http://localhost:3000/api/jobs/${jobId}`, { method: 'DELETE' });
        onJobDeleted();
      } catch (error) {
        console.error('Error al borrar el trabajo:', error);
      }
    }
  };

  return (
    <div>
      <h2>Lista de Trabajos</h2>
      {jobs.length === 0 ? (
        <p>No hay trabajos para mostrar.</p>
      ) : (
        <ul>
          {jobs.map(job => {
            const customer = customers.find(c => c._id === job.customerId);
            return (
              <li key={job._id} style={{ marginBottom: '20px', border: '1px solid #444', padding: '10px', listStyle: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong>
                      {job.vehicleInfo?.make} {job.vehicleInfo?.model} ({job.vehicleInfo?.year}) - {job.vehicleInfo?.trim}
                    </strong>
                    <p style={{ margin: '5px 0 0 0', color: '#aaa' }}>
                       {/* --- Mostramos los nuevos datos --- */}
                      Tipo: {job.vehicleInfo?.vehicleType}, Motor: {job.vehicleInfo?.engineCylinders} Cilindros, Combustible: {job.vehicleInfo?.fuelType}<br/>
                      Cliente: {customer ? customer.name : 'Cargando...'} <br/>
                    </p>
                  </div>
                  <button onClick={() => handleDelete(job._id)}>Borrar</button>
                </div>

                <div style={{ marginTop: '15px', borderTop: '1px dashed #555', paddingTop: '10px' }}>
                  {job.tasks?.map(task => (
                    <div key={task._id}>
                      <h4 style={{ margin: '5px 0' }}>
                        Técnico: {task.technician} <br />
                        Tarea: {task.title} <br />
                      </h4>
                      <p style={{ margin: '0 0 10px 0', fontStyle: 'italic', color: '#ccc' }}>
                        "{task.description}"
                      </p>
                      {task.steps?.map(step => (
                        <Step key={step._id} job={job} task={task} step={step} onUpdate={onJobDeleted} />
                      ))}
                      <AddStepForm jobId={job._id} taskId={task._id} onStepAdded={onJobDeleted} />
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default JobList;
