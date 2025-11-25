// src/pages/ClientForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUpload, FaUser, FaSave, FaTimes } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './ClientForm.css';

function ClientForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        idNumber: '',
        phone: '',
        email: '',
        address: '',
        photoUrl: ''
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchClient();
        }
    }, [id]);

    const fetchClient = async () => {
        try {
            const response = await fetch(`${API_URL}/api/customers`);
            const clients = await response.json();
            const client = clients.find(c => c._id === id);
            if (client) {
                setFormData({
                    name: client.name || '',
                    idNumber: client.idNumber || '',
                    phone: client.phone || '',
                    email: client.email || '',
                    address: client.address || '',
                    photoUrl: client.photoUrl || ''
                });
            }
        } catch (error) {
            console.error('Error fetching client:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.append('file', file);

        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: data
            });
            const result = await response.json();
            if (result.url) {
                setFormData(prev => ({ ...prev, photoUrl: result.url }));
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode
            ? `${API_URL}/api/customers/${id}`
            : `${API_URL}/api/customers`;

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEditMode ? '¡Cliente actualizado exitosamente!' : '¡Cliente creado exitosamente!');
                navigate('/clients');
            } else {
                alert('Error al guardar el cliente');
            }
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-form-view">
            <h2 className="neon-title">{isEditMode ? 'EDITAR REGISTRO DE CLIENTE' : 'NUEVO REGISTRO DE CLIENTE'}</h2>

            <div className="form-container">
                <div className="form-header">
                    <span>ENTRADA DE DATOS DE USUARIO // SYSTEM.NEW_USER</span>
                </div>

                <form onSubmit={handleSubmit} className="neon-form">
                    <div className="form-grid">
                        <div className="input-group">
                            <label>NOMBRE COMPLETO</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="ENTER_FULL_NAME..."
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>ID / CÉDULA</label>
                            <input
                                type="text"
                                name="idNumber"
                                placeholder="ID_NUMBER..."
                                value={formData.idNumber}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group">
                            <label>TELÉFONO MÓVIL</label>
                            <input
                                type="text"
                                name="phone"
                                placeholder="+XX_PHONE_NUMBER..."
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>CORREO ELECTRÓNICO</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="EMAIL_ADDRESS@DOMAIN.COM..."
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="input-group full-width">
                            <label>DIRECCIÓN</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="RESIDENTIAL_ADDRESS..."
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="photo-section">
                        <div className="hexagon-wrapper">
                            <div className="hexagon-border">
                                <div className="hexagon-content">
                                    {formData.photoUrl ? (
                                        <img src={formData.photoUrl} alt="Preview" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <FaUser size={50} />
                                            <p>{uploading ? 'UPLOADING...' : 'UPLOAD ID PHOTO'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <label className="upload-btn">
                            <FaUpload /> Select Photo
                            <input type="file" hidden onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="action-btn save" disabled={loading}>
                            <FaSave /> {loading ? 'GUARDANDO...' : (isEditMode ? 'ACTUALIZAR CLIENTE' : 'GUARDAR EN BASE DE DATOS')}
                        </button>
                        <button type="button" className="action-btn cancel" onClick={() => navigate('/clients')}>
                            <FaTimes /> CANCELAR
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ClientForm;
