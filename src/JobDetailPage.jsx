// src/JobDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './JobDetailPage.css'; // 1. Importamos los nuevos estilos
import { API_URL } from './apiConfig';

import JobStatusUpdater from './components/JobStatusUpdater';
import Step from './components/Step';
import AddStepForm from './components/AddStepForm';

function JobDetailPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true); // Vuelve a poner en estado de carga al refrescar
      const jobRes = await fetch(`${API_URL}/api/jobs/${jobId}`);
      const jobData = await jobRes.json();
      setJob(jobData);

      const customerRes = await fetch(`${API_URL}/api/customers`);
      const customersData = await customerRes.json();
      const jobCustomer = customersData.find(c => c._id === jobData.customerId);
      setCustomer(jobCustomer);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [jobId]);

  if (loading) return <div className="App"><p>Cargando detalles del trabajo...</p></div>;
  if (!job) return <div className="App"><p>Trabajo no encontrado.</p></div>;

  const handleStatusChange = (newStatus) => {
    setJob(prevJob => ({ ...prevJob, status: newStatus }));
  };

  return (
    // 2. Usamos las nuevas clases para estructurar la página
    <div className="App job-detail-page">
      <Link to="/" className="back-link">&larr; Volver a la Torre de Control</Link>
      
      <div className="job-detail-card">
        <div className="job-detail-header">
          <strong>{job.vehicleInfo?.make} {job.vehicleInfo?.model} ({job.vehicleInfo?.year}) - {job.vehicleInfo?.trim}</strong>
          <p>
            Cliente: {customer ? customer.name : 'Cargando...'} <br/>
            Tipo: {job.vehicleInfo?.vehicleType}, Motor: {job.vehicleInfo?.engineCylinders} Cilindros, {job.vehicleInfo?.fuelType}
          </p>
        </div>
        
        <JobStatusUpdater currentStatus={job.status} jobId={job._id} onStatusChange={handleStatusChange} />

        <div className="tasks-section">
          {job.tasks?.map(task => (
            <div key={task._id} className="task-item">
              <h4>Tarea: {task.title} (Técnico: {task.technician})</h4>
              <p>"{task.description}"</p>
              {task.steps?.map(step => (
                <Step key={step._id} job={job} task={task} step={step} onUpdate={fetchData} />
              ))}
              <AddStepForm jobId={job._id} taskId={task._id} onStepAdded={fetchData} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;