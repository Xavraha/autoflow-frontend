// src/components/JobList.jsx

// 1. Aceptamos la nueva propiedad 'onJobDeleted'
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
            <li key={job._id}>
              <strong>
                {job.vehicleInfo?.make} {job.vehicleInfo?.model} ({job.vehicleInfo?.year})
              </strong>
              : {job.tasks && job.tasks.length > 0 ? job.tasks[0].title : 'Sin tareas asignadas'}
              
              <button onClick={() => handleDelete(job._id)} style={{ marginLeft: '10px' }}>
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default JobList;