// src/JobDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { API_URL } from './apiConfig';
<<<<<<< HEAD
import './pages/TaskDetail.css'; // Correct path to the new CSS

function JobDetailPage() {
  const { jobId } = useParams(); // Adapted from id to jobId
=======
import './pages/TaskDetail.css'; // Use the new CSS

function JobDetailPage() {
  const { jobId } = useParams();
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const jobResponse = await fetch(`${API_URL}/api/jobs/${jobId}`);
      const jobData = await jobResponse.json();
      setJob(jobData);

      if (jobData.customerId) {
        const customerResponse = await fetch(`${API_URL}/api/customers`);
        const customers = await customerResponse.json();
        const foundCustomer = customers.find(c => c._id === jobData.customerId);
        setCustomer(foundCustomer);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...job, status: newStatus })
      });
      setJob({ ...job, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteStep = async (stepIndex) => {
    if (!window.confirm('¿Eliminar este paso?')) return;

<<<<<<< HEAD
    // Support both structures for steps
    const currentSteps = job.taskSteps || job.tasks?.[0]?.steps || [];
    const updatedSteps = currentSteps.filter((_, i) => i !== stepIndex);

=======
    const updatedSteps = job.taskSteps?.filter((_, i) => i !== stepIndex) || [];
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
    try {
      await fetch(`${API_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...job, taskSteps: updatedSteps })
      });
      setJob({ ...job, taskSteps: updatedSteps });
    } catch (error) {
      console.error('Error deleting step:', error);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (!job) return <div className="error">Trabajo no encontrado</div>;

  const progressSteps = [
    { label: 'RECEPCIÓN', status: 'completed' },
    { label: 'DIAGNÓSTICO', status: job.status === 'pending_diagnosis' ? 'active' : 'completed' },
    { label: 'REPARACIÓN', status: job.status === 'in_progress' ? 'active' : job.status === 'completed' ? 'completed' : 'pending' },
    { label: 'CONTROL CALIDAD', status: job.status === 'completed' ? 'completed' : 'pending' }
  ];

<<<<<<< HEAD
  // Helper for vehicle info to support both data structures
  const vInfo = job.vehicleInfo || job.vehicleData || {};

=======
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
  return (
    <div className="task-detail-view">
      {/* Header con Back */}
      <div className="detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> BACK
        </button>
      </div>

      <div className="detail-layout">
        {/* Left Panel - Vehicle Status */}
        <div className="left-panel">
          {/* Vehicle Header */}
          <div className="vehicle-header">
            <h2>ESTADO DEL VEHÍCULO</h2>
          </div>

          {/* Status List */}
          <div className="status-list-section">
            <h3>STATUS LIST</h3>
            <div className="status-badges">
              <button
                className={`status-badge ${job.status === 'pending_diagnosis' ? 'active' : ''}`}
                onClick={() => handleStatusChange('pending_diagnosis')}
              >
                DIAGNÓSTICO PENDIENTE
              </button>
              <button
                className={`status-badge ${job.status === 'awaiting_parts' ? 'active' : ''}`}
                onClick={() => handleStatusChange('awaiting_parts')}
              >
                EN ESPERA DE PIEZAS
              </button>
              <button
                className={`status-badge ${job.status === 'in_progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in_progress')}
              >
                EN PROGRESO
              </button>
              <button
                className={`status-badge ${job.status === 'completed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                COMPLETADO
              </button>
              <button
                className={`status-badge ${job.status === 'canceled' ? 'active' : ''}`}
                onClick={() => handleStatusChange('canceled')}
              >
                CANCELADO
              </button>
            </div>
          </div>

          {/* Section 2 - Vehicle Image */}
          <div className="section-2">
            <h3>SECTION 2</h3>
            <div className="vehicle-showcase">
              <div className="vehicle-stats">
                <div className="stat-item">
                  <span className="stat-label">Battery Level:</span>
                  <span className="stat-value">75%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Engine Status:</span>
                  <span className="stat-value">210 bar</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Hydraulic Status:</span>
                  <span className="stat-value">Normal</span>
                </div>
              </div>
              <div className="vehicle-visual">
<<<<<<< HEAD
                {/* Placeholder for vehicle image */}
                <div className="vehicle-placeholder">
                  <span>{vInfo.make || 'VEHICLE'}</span>
=======
                <div className="vehicle-placeholder">
                  <span>{job.vehicleInfo?.make || 'VEHICLE'}</span>
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
                </div>
              </div>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="progress-timeline">
            <h3>PROGRESS TIMELINE</h3>
            <div className="timeline-steps">
              {progressSteps.map((step, index) => (
                <div key={index} className="timeline-step">
                  <div className={`step-icon ${step.status}`}>
<<<<<<< HEAD
                    {step.status === 'completed' && <FaCheckCircle />}
=======
                    {step.status === 'completed' && <FaCheck Circle />}
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
                    {step.status === 'active' && <div className="pulse-ring"></div>}
                    {step.status === 'pending' && <div className="pending-circle"></div>}
                  </div>
                  <div className="step-label">{step.label}</div>
                  {step.status === 'active' && <div className="completion-percent">65% COMPLETE</div>}
                  {index < progressSteps.length - 1 && <div className="step-connector"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="vehicle-info-grid">
            <h3>INFORMACIÓN DEL VEHÍCULO</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">MARCA:</span>
<<<<<<< HEAD
                <span className="info-value">{vInfo.make || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">VIN:</span>
                <span className="info-value">{vInfo.vin || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">BODY:</span>
                <span className="info-value">{vInfo.bodyClass || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MODELO:</span>
                <span className="info-value">{vInfo.model || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">TRIM:</span>
                <span className="info-value">{vInfo.trim || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CYL:</span>
                <span className="info-value">{vInfo.engineCylinders || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">AÑO:</span>
                <span className="info-value">{vInfo.year || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MOTOR:</span>
                <span className="info-value">{vInfo.fuelType || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">TIPO:</span>
                <span className="info-value">{vInfo.vehicleType || 'N/A'}</span>
=======
                <span className="info-value">{job.vehicleInfo?.make || job.vehicleData?.make || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">VIN:</span>
                <span className="info-value">{job.vehicleInfo?.vin || job.vehicleData?.vin || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">BODY:</span>
                <span className="info-value">{job.vehicleInfo?.bodyClass || job.vehicleData?.bodyClass || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MODELO:</span>
                <span className="info-value">{job.vehicleInfo?.model || job.vehicleData?.model || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">TRIM:</span>
                <span className="info-value">{job.vehicleInfo?.trim || job.vehicleData?.trim || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CYL:</span>
                <span className="info-value">{job.vehicleInfo?.engineCylinders || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">AÑO:</span>
                <span className="info-value">{job.vehicleInfo?.year || job.vehicleData?.year || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">MOTOR:</span>
                <span className="info-value">{job.vehicleInfo?.fuelType || 'N/A'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">TIPO:</span>
                <span className="info-value">{job.vehicleInfo?.vehicleType || 'N/A'}</span>
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Action Console */}
        <div className="action-console">
          <h2>CONSOLA DE ACCIÓN</h2>

          <div className="steps-list">
<<<<<<< HEAD
            {(job.taskSteps || job.tasks?.[0]?.steps || []).map((step, index) => (
=======
            {(job.tasks?.[0]?.steps || job.taskSteps || []).map((step, index) => (
>>>>>>> 71b7acc560150796489894c5a2127d78e0b85c2f
              <div key={index} className="action-step">
                <div className="step-header">
                  <h3>STEP {index + 1}</h3>
                  <button className="delete-step-btn" onClick={() => handleDeleteStep(index)}>
                    <FaTrash /> DELETE STEP
                  </button>
                </div>
                <h4>{step.name || step.title || `Paso ${index + 1}`}</h4>

                {step.photos && step.photos.length > 0 && (
                  <div className="media-gallery">
                    <h5>MEDIA GALLERY</h5>
                    <div className="gallery-grid">
                      {step.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="gallery-item">
                          <img src={photo.url || photo} alt={photo.label || `Photo ${photoIndex + 1}`} />
                          <span className="photo-label">{photo.label || `Photo ${photoIndex + 1}`}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(step.comment || step.description) && (
                  <div className="step-comment">
                    <h5>TECHNICIAN'S COMMENT:</h5>
                    <p>{step.comment || step.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button className="add-step-btn">
            <FaPlus /> AÑADIR PASO
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobDetailPage;