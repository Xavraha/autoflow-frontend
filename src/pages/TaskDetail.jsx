// src/pages/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus, FaTrash, FaCheckCircle, FaCamera, FaTimes, FaVideo } from 'react-icons/fa';
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

    // Estados de datos
    const [job, setJob] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    // Estados de UI
    const [showAddStepModal, setShowAddStepModal] = useState(false);
    const [newStepData, setNewStepData] = useState({ name: '', comment: '' });

    // Cargar datos
    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async (showLoading = true) => {
        try {
            if (showLoading) setLoading(true);
            const jobResponse = await fetch(`${API_URL}/api/jobs/${id}`);
            const jobData = await jobResponse.json();
            console.log('Job data loaded:', jobData); // Debug
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
            if (showLoading) setLoading(false);
        }
    };

    // Actualizar Estado General
    const handleStatusChange = async (newStatus) => {
        try {
            // Actualización optimista para rapidez visual
            setJob({ ...job, status: newStatus });
            await fetch(`${API_URL}/api/jobs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
        } catch (error) {
            console.error('Error updating status:', error);
            fetchJobDetails(); // Revertir si falla
        }
    };

    // --- FUNCIONES DE PASOS ---

    const handleAddStep = async () => {
        if (!newStepData.name.trim()) return alert('El nombre del paso es requerido');

        const newStep = {
            description: newStepData.name,
            comment: newStepData.comment || '',
            photo_before: null,
            photo_after: null,
            video_url: null
        };

        try {
            console.log('Creando nuevo paso:', newStep);

            // Usar el endpoint correcto del backend
            const taskId = job.tasks[0]._id;
            console.log('Task ID:', taskId, 'Job ID:', id);

            const response = await fetch(`${API_URL}/api/jobs/${id}/tasks/${taskId}/steps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStep)
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Error response:', errorData);
                throw new Error('Error al crear paso en el servidor');
            }

            const result = await response.json();
            console.log('Paso creado exitosamente:', result);

            //Recargar la página completa para mostrar el nuevo paso
            alert('Paso creado exitosamente');
            window.location.reload();
        } catch (error) {
            console.error('Error adding step:', error);
            alert('Error al agregar paso: ' + error.message);
        }
    };

    const handleDeleteStep = async (stepIndex) => {
        if (!window.confirm('¿Estás seguro de eliminar este paso?')) return;

        try {
            console.log('Eliminando paso:', stepIndex);
            const updatedTasks = [...job.tasks];
            updatedTasks[0].steps.splice(stepIndex, 1);

            // Solo enviar las tareas actualizadas, no todo el job
            const response = await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks })
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Response error:', errorData);
                throw new Error('Error en la respuesta del servidor');
            }

            console.log('Paso eliminado, recargando datos...');
            await fetchJobDetails(false);
            alert('Paso eliminado correctamente');
        } catch (error) {
            console.error('Error deleting step:', error);
            alert('Error al eliminar paso: ' + error.message);
        }
    };

    const handleUploadPhoto = async (stepIndex, file, photoType = 'photo_before') => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Subiendo archivo:', file.name, file.type);

            // 1. Subir a Cloudinary
            const uploadRes = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) {
                throw new Error(uploadData.error || 'Error uploading');
            }

            console.log('Archivo subido a Cloudinary:', uploadData.url);

            // 2. Actualizar el paso con la URL
            const updatedTasks = [...job.tasks];
            const step = updatedTasks[0].steps[stepIndex];

            // Determinar si es video o imagen
            const isVideoFile = file.type.startsWith('video/');
            console.log('Es video?', isVideoFile);

            if (isVideoFile) {
                step.video_url = uploadData.url;
                step.photo_before = null;
                step.photo_after = null;
            } else {
                // Solo una imagen por paso
                console.log('Añadiendo como photo_before');
                step.photo_before = uploadData.url;
                step.photo_after = null;
                step.video_url = null;
            }

            console.log('Actualizando job con nueva media...');
            const updateRes = await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks })
            });

            if (!updateRes.ok) {
                const errorData = await updateRes.text();
                console.error('Update error:', errorData);
                throw new Error('Error al actualizar el job');
            }

            console.log('Job actualizado, recargando datos...');
            await fetchJobDetails(false);
            alert('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Error al subir archivo: ' + error.message);
        }
    };

    const handleDeletePhoto = async (stepIndex, photoType) => {
        if (!window.confirm('¿Eliminar este archivo?')) return;

        try {
            const updatedTasks = [...job.tasks];
            updatedTasks[0].steps[stepIndex][photoType] = null;

            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks })
            });

            await fetchJobDetails(false);
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };

    if (loading) return <div className="task-detail-view" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>CARGANDO SISTEMA...</h2></div>;
    if (!job) return <div className="task-detail-view"><h2>ERROR: TRABAJO NO ENCONTRADO</h2></div>;
    if (!job.tasks || job.tasks.length === 0) return <div className="task-detail-view"><h2>ERROR: NO HAY TAREAS ASOCIADAS</h2></div>;

    // Obtener los pasos de la primera tarea
    const currentTask = job.tasks[0];
    const steps = currentTask.steps || [];

    return (
        <div className="task-detail-view">
            {/* Header */}
            <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> VOLVER
                </button>
            </div>

            <div className="detail-layout">
                {/* --- SECCIÓN SUPERIOR: ESTADO E INFO --- */}
                <div className="top-section">
                    <div className="vehicle-header">
                        <h2>ESTADO DEL VEHÍCULO</h2>
                    </div>

                    {/* Lista de Estados */}
                    <div className="status-list-section">
                        <h3>STATUS LIST</h3>
                        <div className="status-badges">
                            {Object.keys(STATUS_LABELS).map(key => (
                                <button
                                    key={key}
                                    className={`status-badge ${job.status === key ? 'active' : ''}`}
                                    onClick={() => handleStatusChange(key)}
                                >
                                    {STATUS_LABELS[key]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Info Vehículo */}
                    <div className="vehicle-info-grid">
                        <h3>INFORMACIÓN DEL VEHÍCULO</h3>

                        {/* VIN Section - Full Width */}

                        <div className="info-grid">
                            <div className="info-item"><span className="info-label">MARCA:</span><span className="info-value">{job.vehicleInfo?.make}</span></div>
                            <div className="info-item"><span className="info-label">MODELO:</span><span className="info-value">{job.vehicleInfo?.model}</span></div>
                            <div className="info-item"><span className="info-label">AÑO:</span><span className="info-value">{job.vehicleInfo?.year}</span></div>
                            <div className="info-item"><span className="info-label">MOTOR:</span><span className="info-value">{job.vehicleInfo?.engineCylinders || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">CLIENTE:</span><span className="info-value">{customer?.name || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">FUEL:</span><span className="info-value">{job.vehicleInfo?.fuelType || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">VIN CODE:</span><span className="info-value">{job.vehicleInfo?.vin || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>

                {/* --- SECCIÓN INFERIOR: PASOS (GRID) --- */}
                <div className="action-console">
                    <div className="section-header-row">
                        <h2 className="section-title">Tarea: {currentTask.title}</h2>
                        <button className="add-step-btn" onClick={() => setShowAddStepModal(true)}>
                            <FaPlus /> NUEVO PASO
                        </button>
                    </div>

                    <div className="steps-list">
                        {steps.length === 0 && (
                            <div className="no-steps-message">
                                <p>No hay pasos registrados aÃºn.</p>
                                <p>Usa el botÃ³n "NUEVO PASO" arriba a la derecha.</p>
                            </div>
                        )}

                        {steps.map((step, index) => (
                            <div key={step._id || index} className="action-step">
                                {/* 1. Header: Paso # y Eliminar */}
                                <div className="step-header">
                                    <h3>PASO #{index + 1}</h3>
                                    <button className="delete-step-btn" onClick={() => handleDeleteStep(index)}>
                                        <FaTrash /> ELIMINAR
                                    </button>
                                </div>

                                {/* 2. & 3. Título y Comentario Unificados */}
                                <div className="step-comment">
                                    <h5 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{step.description}</h5>
                                    {step.comment && <p>{step.comment}</p>}
                                </div>

                                {/* 4. Evidencia Multimedia */}
                                <div className="media-gallery">
                                    {/* <h5>EVIDENCIA MULTIMEDIA</h5> - Oculto para ahorrar espacio si se desea, o mostrar */}
                                    <div className="gallery-grid">
                                        {/* Foto ANTES */}
                                        {step.photo_before && (
                                            <div className="gallery-item">
                                                <img src={step.photo_before} alt="Antes" onClick={() => window.open(step.photo_before, '_blank')} style={{ cursor: 'pointer' }} />
                                                <span className="media-label">ANTES</span>
                                                <button
                                                    onClick={() => handleDeletePhoto(index, 'photo_before')}
                                                    style={{
                                                        position: 'absolute', top: '5px', right: '5px',
                                                        background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%',
                                                        width: '20px', height: '20px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black'
                                                    }}
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Foto DESPUÃ‰S */}
                                        {step.photo_after && (
                                            <div className="gallery-item">
                                                <img src={step.photo_after} alt="DespuÃ©s" onClick={() => window.open(step.photo_after, '_blank')} style={{ cursor: 'pointer' }} />
                                                <span className="media-label">DESPUÃ‰S</span>
                                                <button
                                                    onClick={() => handleDeletePhoto(index, 'photo_after')}
                                                    style={{
                                                        position: 'absolute', top: '5px', right: '5px',
                                                        background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%',
                                                        width: '20px', height: '20px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black'
                                                    }}
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Video */}
                                        {step.video_url && (
                                            <div className="gallery-item">
                                                <video src={step.video_url} controls />
                                                <span className="media-label">VIDEO</span>
                                                <button
                                                    onClick={() => handleDeletePhoto(index, 'video_url')}
                                                    style={{
                                                        position: 'absolute', top: '5px', right: '5px',
                                                        background: 'rgba(255, 255, 255, 0.8)', border: 'none', borderRadius: '50%',
                                                        width: '20px', height: '20px', display: 'flex',
                                                        alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black'
                                                    }}
                                                >
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        )}

                                        {/* BotÃ³n de Subida - Solo si NO hay media */}
                                        {!step.photo_before && !step.video_url && (
                                            <div className="gallery-item" style={{ border: '2px dashed #00f3ff', background: 'rgba(0, 243, 255, 0.05)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                <input
                                                    type="file"
                                                    id={`upload-${index}`}
                                                    style={{ display: 'none' }}
                                                    accept="image/*,video/*"
                                                    onChange={(e) => handleUploadPhoto(index, e.target.files[0])}
                                                />
                                                <label htmlFor={`upload-${index}`} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#00f3ff' }}>
                                                    <FaCamera size={24} style={{ marginBottom: '5px' }} />
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>SUBIR</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- MODAL FLOTANTE --- */}
            {showAddStepModal && (
                <div className="modal-overlay" onClick={() => setShowAddStepModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 style={{ color: '#00f3ff', textAlign: 'center', marginBottom: '1.5rem' }}>NUEVO PASO OPERATIVO</h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.8rem' }}>NOMBRE DEL PASO</label>
                            <input
                                type="text"
                                placeholder="Ej: Desmontaje de culata..."
                                value={newStepData.name}
                                onChange={(e) => setNewStepData({ ...newStepData, name: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: '#0a0a15', border: '1px solid #333', color: '#fff', borderRadius: '4px' }}
                                autoFocus
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', color: '#aaa', marginBottom: '0.5rem', fontSize: '0.8rem' }}>COMENTARIO (Opcional)</label>
                            <textarea
                                rows="3"
                                placeholder="Detalles tÃ©cnicos..."
                                value={newStepData.comment}
                                onChange={(e) => setNewStepData({ ...newStepData, comment: e.target.value })}
                                style={{ width: '100%', padding: '10px', background: '#0a0a15', border: '1px solid #333', color: '#fff', borderRadius: '4px', resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => setShowAddStepModal(false)}
                                style={{ padding: '0.8rem 1.5rem', background: 'transparent', border: '1px solid #666', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                CANCELAR
                            </button>
                            <button
                                onClick={handleAddStep}
                                style={{ padding: '0.8rem 1.5rem', background: 'linear-gradient(135deg, #00f3ff, #0066ff)', border: 'none', color: '#000', fontWeight: 'bold', borderRadius: '4px', cursor: 'pointer' }}
                            >
                                CREAR PASO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TaskDetail;
