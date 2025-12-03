// src/pages/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTrash, FaPlus, FaCloudUploadAlt, FaVideo, FaImage } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './TaskDetail.css';

const STATUS_LABELS = {
    pending_diagnosis: 'DIAGNÓSTICO PENDIENTE',
    awaiting_parts: 'EN ESPERA DE PIEZAS',
    in_progress: 'EN PROGRESO',
    completed: 'COMPLETADO',
    cancelled: 'CANCELADO'
};

function TaskDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddStepModal, setShowAddStepModal] = useState(false);
    const [newStepData, setNewStepData] = useState({ name: '', comment: '' });
    const [uploading, setUploading] = useState(false);

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
            console.log('Updating status to:', newStatus);
            // Actualización optimista
            setJob({ ...job, status: newStatus });

            // Usar endpoint específico para estado
            const response = await fetch(`${API_URL}/api/jobs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                throw new Error('Error al actualizar estado');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar estado');
            fetchJobDetails(false); // Revertir si falla
        }
    };

    // --- FUNCIONES DE PASOS (CORREGIDAS PARA USAR tasks[0].steps) ---

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

            const response = await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks }) // Only sending tasks
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

    // --- FUNCIONES DE ARCHIVOS (Cloudinary) ---

    const handleUploadPhoto = async (stepIndex, file) => {
        if (!file) return;

        const isVideo = file.type.startsWith('video/');
        const isImage = file.type.startsWith('image/');

        if (!isVideo && !isImage) {
            return alert('Solo se permiten imágenes o videos');
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'autoflow_preset'); // Reemplaza con tu preset real

        try {
            setUploading(true);
            console.log('Subiendo archivo a Cloudinary:', file.name);

            const res = await fetch('https://api.cloudinary.com/v1_1/dbwolldlx/upload', { // Reemplaza con tu cloud name
                method: 'POST',
                body: formData
            });

            if (!res.ok) throw new Error('Error subiendo a Cloudinary');

            const data = await res.json();
            console.log('Archivo subido a Cloudinary:', data.secure_url);

            // Actualizar el paso con la URL
            const updatedTasks = [...job.tasks];
            const step = updatedTasks[0].steps[stepIndex];

            console.log('Es video?', isVideo);

            if (isVideo) {
                step.video_url = data.secure_url;
                step.photo_before = null; // Limpiar imagen si sube video
                step.photo_after = null;
                console.log('Añadiendo como video_url');
            } else {
                step.photo_before = data.secure_url;
                step.video_url = null; // Limpiar video si sube imagen
                step.photo_after = null;
                console.log('Añadiendo como photo_before');
            }

            console.log('Actualizando job con nueva media...');

            // Guardar en backend
            const updateRes = await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks }) // Only sending tasks
            });

            if (!updateRes.ok) throw new Error('Error actualizando base de datos');

            console.log('Job actualizado, recargando datos...');
            await fetchJobDetails(false);
            alert('Archivo subido exitosamente');
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Error al subir archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePhoto = async (stepIndex, field) => {
        if (!window.confirm('¿Eliminar este archivo?')) return;

        try {
            const updatedTasks = [...job.tasks];
            updatedTasks[0].steps[stepIndex][field] = null;

            await fetch(`${API_URL}/api/jobs/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tasks: updatedTasks }) // Only sending tasks
            });

            await fetchJobDetails(false);
        } catch (error) {
            console.error('Error deleting photo:', error);
        }
    };


    if (loading) return <div className="loading-screen">CARGANDO SISTEMA...</div>;
    if (!job) return <div className="error-screen">TAREA NO ENCONTRADA</div>;

    const steps = job.tasks?.[0]?.steps || [];

    return (
        <div className="task-detail-container">
            {/* Header */}
            <div className="task-header">
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FaArrowLeft /> VOLVER
                </button>
                <button
                    className="add-step-btn"
                    onClick={() => setShowAddStepModal(true)}
                >
                    <FaPlus /> NUEVO PASO
                </button>
            </div>

            <div className="detail-layout">
                {/* --- PANEL IZQUIERDO (Info y Status) --- */}
                <div className="left-panel">
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

                    {/* Timeline de Progreso */}
                    <div className="progress-timeline">
                        <h3>LÍNEA DE TIEMPO</h3>
                        <div className="timeline-steps">
                            <div className="timeline-step">
                                <div className={`step-icon ${job.status !== 'pending_diagnosis' ? 'completed' : 'active'}`}><FaCheckCircle /></div>
                                <span className="step-label">DIAGNÓSTICO</span>
                                <div className="step-connector"></div>
                            </div>
                            <div className="timeline-step">
                                <div className={`step-icon ${job.status === 'in_progress' ? 'active' : (job.status === 'completed' ? 'completed' : 'pending')}`}><FaCheckCircle /></div>
                                <span className="step-label">REPARACIÓN</span>
                                <div className="step-connector"></div>
                            </div>
                            <div className="timeline-step">
                                <div className={`step-icon ${job.status === 'completed' ? 'completed' : 'pending'}`}><FaCheckCircle /></div>
                                <span className="step-label">ENTREGA</span>
                            </div>
                        </div>
                    </div>

                    {/* Info Vehículo */}
                    <div className="vehicle-info-grid">
                        <h3>INFORMACIÓN DEL VEHÍCULO</h3>
                        <div className="info-grid">
                            <div className="info-item"><span className="info-label">MARCA:</span><span className="info-value">{job.vehicleInfo?.make}</span></div>
                            <div className="info-item"><span className="info-label">MODELO:</span><span className="info-value">{job.vehicleInfo?.model}</span></div>
                            <div className="info-item"><span className="info-label">AÑO:</span><span className="info-value">{job.vehicleInfo?.year}</span></div>
                            <div className="info-item"><span className="info-label">VIN:</span><span className="info-value">{job.vehicleInfo?.vin || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">CLIENTE:</span><span className="info-value">{customer?.name || 'N/A'}</span></div>
                            <div className="info-item"><span className="info-label">MOTOR:</span><span className="info-value">{job.vehicleInfo?.engineCylinders || 'N/A'}</span></div>
                        </div>
                    </div>
                </div>

                {/* --- PANEL DERECHO: SECCIÓN 2 (Pasos y Acción) --- */}
                <div className="action-console">
                    <div className="vehicle-header">
                        <h2 style={{ color: '#d900ff' }}>SECCIÓN 2: PROCESO TÉCNICO</h2>
                        <p style={{ color: '#888', marginTop: '0.5rem' }}>Tarea: {job.tasks?.[0]?.description}</p>
                    </div>

                    <div className="steps-list">
                        {steps.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                <p>No hay pasos registrados aún.</p>
                                <p>Usa el botón "NUEVO PASO" arriba a la derecha.</p>
                            </div>
                        )}

                        {steps.map((step, index) => (
                            <div key={step._id || index} className="action-step">
                                <div className="step-header">
                                    <h3>PASO #{index + 1}</h3>
                                    <button className="delete-step-btn" onClick={() => handleDeleteStep(index)}>
                                        <FaTrash /> ELIMINAR
                                    </button>
                                </div>
                                <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>{step.description}</h4>

                                {step.comment && (
                                    <div className="step-comment" style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(0, 243, 255, 0.05)', borderLeft: '3px solid #00f3ff', borderRadius: '4px' }}>
                                        <h5 style={{ fontSize: '0.8rem', color: '#00f3ff', marginBottom: '0.5rem' }}>COMENTARIO TÉCNICO:</h5>
                                        <p style={{ fontSize: '0.9rem', color: '#ccc', margin: 0 }}>{step.comment}</p>
                                    </div>
                                )}

                                <div className="step-media-gallery">
                                    <p style={{ color: '#666', fontSize: '0.8rem', marginBottom: '0.5rem' }}>EVIDENCIA MULTIMEDIA</p>

                                    <div className="media-grid">
                                        {/* Mostrar Imagen */}
                                        {step.photo_before && (
                                            <div className="media-item">
                                                <img src={step.photo_before} alt="Evidencia" />
                                                <span className="media-tag">ANTES</span>
                                                <button
                                                    className="delete-media-btn"
                                                    onClick={() => handleDeletePhoto(index, 'photo_before')}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}

                                        {/* Mostrar Video */}
                                        {step.video_url && (
                                            <div className="media-item video">
                                                <video controls src={step.video_url}></video>
                                                <span className="media-tag video">VIDEO</span>
                                                <button
                                                    className="delete-media-btn"
                                                    onClick={() => handleDeletePhoto(index, 'video_url')}
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        )}

                                        {/* Botón de Subir (Solo si no hay media) */}
                                        {!step.photo_before && !step.video_url && (
                                            <div className="upload-placeholder">
                                                <input
                                                    type="file"
                                                    id={`file-${index}`}
                                                    style={{ display: 'none' }}
                                                    accept="image/*,video/*"
                                                    onChange={(e) => handleUploadPhoto(index, e.target.files[0])}
                                                    disabled={uploading}
                                                />
                                                <label htmlFor={`file-${index}`} className="upload-btn">
                                                    {uploading ? (
                                                        <span>Subiendo...</span>
                                                    ) : (
                                                        <>
                                                            <FaCloudUploadAlt size={24} />
                                                            <span>SUBIR</span>
                                                        </>
                                                    )}
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

            {/* Modal Nuevo Paso */}
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
                                placeholder="Detalles técnicos..."
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