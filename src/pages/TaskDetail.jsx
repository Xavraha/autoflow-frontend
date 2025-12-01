// src/pages/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './TaskDetail.css';

const STATUS_LABELS = {
    pending_diagnosis: "DIAGNÓSTICO PENDIENTE",
    awaiting_parts: "EN ESPERA DE PIEZAS",
    in_progress: "EN PROGRESO",
    completed: "COMPLETADO",
    canceled: "CANCELADO"
};

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            setJob(null);
            setCustomer(null);

            const jobResponse = await fetch(`${API_URL}/api/jobs/${id}`);
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
            await fetch(`${API_URL}/api/jobs/${id}`, {
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

        const updatedSteps = job.taskSteps.filter((_, i) => i !== stepIndex);
        try {
            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...job, taskSteps: updatedSteps })
            });
            setJob({ ...job, taskSteps: updatedSteps });
        } catch (error) {
            console.error('Error deleting step:', error);
        }
    };

    const handleUploadPhoto = async (stepIndex, file) => {
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || 'Error uploading to Cloudinary');
            }

            // Add photo to the step
            const updatedSteps = [...job.taskSteps];
            if (!updatedSteps[stepIndex].photos) {
                updatedSteps[stepIndex].photos = [];
            }
            updatedSteps[stepIndex].photos.push({
                url: uploadData.url,
                label: file.name,
                uploadedAt: new Date().toISOString()
            });

            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...job, taskSteps: updatedSteps })
            });

            setJob({ ...job, taskSteps: updatedSteps });
            alert('¡Archivo subido exitosamente!');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert(`Error al subir archivo: ${error.message}`);
        }
    };

    const handleDeletePhoto = async (stepIndex, photoIndex) => {
        if (!window.confirm('¿Eliminar esta foto/video?')) return;

        const updatedSteps = [...job.taskSteps];
        updatedSteps[stepIndex].photos.splice(photoIndex, 1);

        try {
            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...job, taskSteps: updatedSteps })
            });
            setJob({ ...job, taskSteps: updatedSteps });
        } catch (error) {
            console.error('Error deleting photo:', error);
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
                                {/* Placeholder for vehicle image */}
                                <div className="vehicle-placeholder">
                                    <span>CYBERTRUCK</span>
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
                                        {step.status === 'completed' && <FaCheckCircle />}
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
                                <span className="info-value">{job.vehicleInfo?.make || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">VIN:</span>
                                <span className="info-value">{job.vehicleInfo?.vin || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">BODY:</span>
                                <span className="info-value">{job.vehicleInfo?.bodyClass || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">MODELO:</span>
                                <span className="info-value">{job.vehicleInfo?.model || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">TRIM:</span>
                                <span className="info-value">{job.vehicleInfo?.trim || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">CYL:</span>
                                <span className="info-value">N/A</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">AÑO:</span>
                                <span className="info-value">{job.vehicleInfo?.year || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">COLOR:</span>
                                <span className="info-value">{job.vehicleInfo?.color || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">FUEL:</span>
                                <span className="info-value">{job.vehicleInfo?.fuelType || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Action Console */}
                <div className="action-console">
                    <h2>CONSOLA DE ACCIÓN</h2>

                    <div className="steps-list">
                        {job.taskSteps && job.taskSteps.map((step, index) => (
                            <div key={index} className="action-step">
                                <div className="step-header">
                                    <h3>STEP {index + 1}</h3>
                                    <button className="delete-step-btn" onClick={() => handleDeleteStep(index)}>
                                        <FaTrash /> DELETE STEP
                                    </button>
                                </div>
                                <h4>{step.name}</h4>

                                {/* Upload Section */}
                                <div className="upload-section" style={{ marginTop: '15px', marginBottom: '15px' }}>
                                    <input
                                        type="file"
                                        id={`file-upload-${index}`}
                                        accept="image/*,video/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleUploadPhoto(index, e.target.files[0]);
                                                e.target.value = ''; // Reset input
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor={`file-upload-${index}`}
                                        className="upload-btn"
                                        style={{
                                            display: 'inline-block',
                                            padding: '10px 20px',
                                            background: 'linear-gradient(135deg, #00f2ff, #0066ff)',
                                            color: '#000',
                                            fontWeight: 'bold',
                                            borderRadius: '5px',
                                            cursor: 'pointer',
                                            border: 'none',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        <FaPlus /> UPLOAD PHOTO/VIDEO
                                    </label>
                                </div>

                                {step.photos && step.photos.length > 0 && (
                                    <div className="media-gallery">
                                        <h5>MEDIA GALLERY</h5>
                                        <div className="gallery-grid">
                                            {step.photos.map((photo, photoIndex) => (
                                                <div key={photoIndex} className="gallery-item" style={{ position: 'relative' }}>
                                                    {photo.url.includes('.mp4') || photo.url.includes('.mov') || photo.url.includes('.webm') ? (
                                                        <video src={photo.url} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <img src={photo.url} alt={photo.label} />
                                                    )}
                                                    <span className="photo-label">{photo.label}</span>
                                                    <button
                                                        onClick={() => handleDeletePhoto(index, photoIndex)}
                                                        style={{
                                                            position: 'absolute',
                                                            top: '5px',
                                                            right: '5px',
                                                            background: '#ff0066',
                                                            border: 'none',
                                                            borderRadius: '50%',
                                                            width: '30px',
                                                            height: '30px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#fff',
                                                            fontSize: '16px'
                                                        }}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {step.comment && (
                                    <div className="step-comment">
                                        <h5>TECHNICIAN'S COMMENT:</h5>
                                        <p>{step.comment}</p>
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

export default TaskDetail;
