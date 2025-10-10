// src/components/JobList.jsx
import Step from './Step'; // Importamos el nuevo componente

function JobList({ jobs, onJobDeleted }) {

  const handleDelete = async (jobId) => {
    if (window.confirm('¿Estás seguro de que quieres borrar este trabajo?')) {
      try {
        await fetch(`http://localhost:3000/api/jobs/${jobId}`, {
          method: 'DELETE',
        });
        
        // 2. LLAMAMOS A LA FUNCIÓN DEL PADRE PARA ACTUALIZAR
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
          {jobs.map(job => (
            <li key={job._id} style={{ marginBottom: '20px' }}>
              <strong>
                {job.vehicleInfo?.make} {job.vehicleInfo?.model} ({job.vehicleInfo?.year})
              </strong>
              <button onClick={() => handleDelete(job._id)} style={{ marginLeft: '10px' }}>
                Borrar
              </button>

              {job.tasks?.map(task => (
                <div key={task._id} style={{ marginTop: '10px' }}>
                  <h4 style={{ margin: 0 }}>Tarea: {task.title} ({task.technician})</h4>
                  {task.steps?.map(step => (
                    <Step key={step._id} job={job} task={task} step={step} onUpdate={onJobDeleted} />
                  ))}
                </div>
              ))}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;
