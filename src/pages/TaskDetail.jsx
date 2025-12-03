import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaCheckCircle, FaCamera, FaTimes } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './TaskDetail.css';

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estado para el modal de agregar paso
    const [showAddStepModal, setShowAddStepModal] = useState(false);
    const [newStepData, setNewStepData] = useState({ name: '', comment: '' });

    // Cargar datos al iniciar
    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
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
            console.error('Error fetching details:', error);
        } finally {
            setLoading(false);
        }
    };

    // Actualizar Estado General (Pending, In Progress, etc.)
    const handleStatusChange = async (newStatus) => {
        try {
            const updatedJob = { ...job, status: newStatus };
            setJob(updatedJob); // Actualización optimista
            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedJob)
            });
        } catch (error) {
            console.error('Error updating status:', error);
            fetchJobDetails(); // Revertir si falla
        }
    };

    // --- LÓGICA DE PASOS ---

    // 1. Agregar Paso Nuevo
    const handleAddStep = async () => {
        if (!newStepData.name.trim()) return alert('El nombre del paso es requerido');

        const newStep = {
            name: newStepData.name,
            comment: newStepData.comment || '',
            photos: []
        };
        const updatedSteps = [...(job.taskSteps || []), newStep];

        try {
            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...job, taskSteps: updatedSteps })
            });
            setJob({ ...job, taskSteps: updatedSteps });
            setNewStepData({ name: '', comment: '' });
            setShowAddStepModal(false);
        } catch (error) {
            console.error('Error adding step:', error);
            alert('Error al guardar el paso');
        }
    };

    // 2. Borrar Paso
    const handleDeleteStep = async (stepIndex) => {
        if (!window.confirm('¿Eliminar este paso completo?')) return;
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

    // 3. Subir Foto/Video a un Paso
    const handleUploadPhoto = async (stepIndex, file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            // Subir a Cloudinary
            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();
            if (!uploadRes.ok) throw new Error(uploadData.error || 'Error uploading');

            // Actualizar DB
            const updatedSteps = [...job.taskSteps];
            if (!updatedSteps[stepIndex].photos) updatedSteps[stepIndex].photos = [];

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
            alert('Archivo subido correctamente');
        } catch (error) {
            console.error('Error uploading:', error);
            alert('Error al subir archivo');
        }
    };

    // 4. Borrar Foto de un Paso
    const handleDeletePhoto = async (stepIndex, photoIndex) => {
        if (!window.confirm('¿Eliminar este archivo?')) return;
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

    if (loading) return <div className="task-detail-view" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>CARGANDO DATOS...</h2></div>;
    if (!job) return <div className="task-detail-view"><h2>TRABAJO NO ENCONTRADO</h2></div>;

    // Helpers para la línea de tiempo
    const isDiagnosis = job.status === 'pending_diagnosis';
    const isWaiting = job.status === 'awaiting_parts';
    const isInProgress = job.status === 'in_progress';
    const isCompleted = job.status === 'completed';

    return (
        <div className="task-detail-view">
            {/* --- HEADER --- */}
            <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> VOLVER
                </button>
                {/* Botón Principal para Añadir Tarea */}
                <button className="add-step-main-btn" onClick={() => setShowAddStepModal(true)}>
                    <FaPlus /> AÑADIR PASO
                </button>
            </div>

            <div className="detail-layout">

                {/* --- PANEL IZQUIERDO (Info y Status) --- */}
                <div className="left-panel">

                    {/* Status List */}
                    <div className="status-list-section">
                        <h3>STATUS LIST</h3>
                        <div className="status-badges">
                            {['pending_diagnosis', 'awaiting_parts', 'in_progress', 'completed', 'canceled'].map(st => (
                                <button
                                    key={st}
                                    className={`status-badge ${job.status === st ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(st)}
                                >
                                    {st.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Progress Timeline Visual */}
                    <div className="progress-timeline">
                        <h3>PROGRESS TIMELINE</h3>
                        <div className="timeline-steps">
                            <div className={`timeline-step`}>
                                <div className={`step-icon ${isDiagnosis || isWaiting || isInProgress || isCompleted ? 'completed' : 'pending'}`}><FaCheckCircle /></div>
                                <div className="step-label">DIAGNÓSTICO</div>
                                <div className="step-connector"></div>
                            </div>
                            <div className={`timeline-step`}>
                                <div className={`step-icon ${isInProgress || isCompleted ? 'completed' : 'pending'}`}><FaCheckCircle /></div>
                                <div className="step-label">REPARACIÓN</div>
                                <div className="step-connector"></div>
                            </div>
                            <div className={`timeline-step`}>
                                <div className={`step-icon ${isCompleted ? 'completed' : 'pending'}`}><FaCheckCircle /></div>
                                <div className="step-label">CALIDAD</div>
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div className="vehicle-info-grid">
                        <h3>INFORMACIÓN DEL VEHÍCULO</h3>
                        <div className="info-grid">
                            <div className="info-item"><span className="info-label">MARCA:</span><span className="info-value">{job.vehicleInfo?.make}</span></div>
                            <div className="info-item"><span className="info-label">MODELO:</span><span className="info-value">{job.vehicleInfo?.model}</span></div>
                            <div className="info-item"><span className="info-label">AÑO:</span><span className="info-value">{job.vehicleInfo?.year}</span></div>
                            <div className="info-item"><span className="info-label">VIN:</span><span className="info-value">{job.vehicleInfo?.vin || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">CLIENTE:</span><span className="info-value">{customer?.name || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">MOTOR:</span><span className="info-value">{job.vehicleInfo?.engineCylinders ? `${job.vehicleInfo.engineCylinders} Cyl` : 'N/A'}</span></div>
                        </div>
                    </div>
                </div>

                {/* --- PANEL DERECHO (SECCIÓN 2 - Pasos/Acciones) --- */}
                <div className="action-console">
                    <div className="vehicle-header">
                        <h2>SECCIÓN 2: {job.vehicleInfo?.model || 'VEHÍCULO'}</h2>
                    </div>

                    <div className="steps-list">
                        {(!job.taskSteps || job.taskSteps.length === 0) && (
                            <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
                                No hay pasos registrados. Usa el botón "AÑADIR PASO" para comenzar.
                            </p>
                        )}

                        {job.taskSteps && job.taskSteps.map((step, index) => (
                            <div key={index} className="action-step">
                                <div className="step-header">
                                    <h3>PASO #{index + 1}</h3>
                                    <button className="delete-step-btn" onClick={() => handleDeleteStep(index)}>
                                        <FaTrash /> ELIMINAR
                                    </button>
                                </div>
                                <h4>{step.name}</h4>

                                {step.comment && (
                                    <div className="step-comment">
                                        <h5>COMENTARIO TÉCNICO:</h5>
                                        <p>{step.comment}</p>
                                    </div>
                                )}

                                {/* Galería de Medios */}
                                <div className="media-gallery">
                                    <div className="gallery-grid">
                                        {/* Fotos existentes */}
                                        {step.photos && step.photos.map((photo, pIndex) => (
                                            <div key={pIndex} className="gallery-item">
                                                {photo.url.match(/\.(mp4|webm|mov)$/i) ? (
                                                    <video src={photo.url} controls />
                                                ) : (
                                                    <img src={photo.url} alt="Evidencia" onClick={() => window.open(photo.url, '_blank')} style={{ cursor: 'pointer' }} />
                                                )}
                                                <button
                                                    onClick={() => handleDeletePhoto(index, pIndex)}
                                                    style={{
                                                        position: 'absolute', top: '5px', right: '5px',
                                                        background: '#ff0055', border: 'none', borderRadius: '50%',
                                                        width: '25px', height: '25px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white'
                                                    }}
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Botón de Subida (Integrado en la galería) */}
                                        <div className="gallery-item" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '2px dashed #00f3ff', background: 'rgba(0, 243, 255, 0.05)' }}>
                                            <input
                                                type="file"
                                                id={`upload-${index}`}
                                                style={{ display: 'none' }}
                                                accept="image/*,video/*"
                                                onChange={(e) => handleUploadPhoto(index, e.target.files[0])}
                                            />
                                            <label htmlFor={`upload-${index}`} style={{ cursor: 'pointer', textAlign: 'center', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#00f3ff' }}>
                                                <FaCamera size={24} />
                                                <span style={{ fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold' }}>SUBIR</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL PARA AÑADIR PASO --- */}
            {showAddStepModal && (
                <div className="modal-overlay" onClick={() => setShowAddStepModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>NUEVO PASO OPERATIVO</h3>

                        <div className="modal-form-group">
                            <label>NOMBRE DEL PASO</label>
                            <input
                                className="modal-input"
                                type="text"
                                placeholder="Ej: Desmontaje de culata..."
                                value={newStepData.name}
                                onChange={(e) => setNewStepData({ ...newStepData, name: e.target.value })}
                                autoFocus
                            />
                        </div>

                        <div className="modal-form-group">
                            <label>COMENTARIO TÉCNICO (Opcional)</label>
                            <textarea
                                className="modal-textarea"
                                rows="3"
                                placeholder="Observaciones o detalles..."
                                value={newStepData.comment}
                                onChange={(e) => setNewStepData({ ...newStepData, comment: e.target.value })}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowAddStepModal(false)}>CANCELAR</button>
                            <button className="btn-confirm" onClick={handleAddStep}>CREAR PASO</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskDetail;