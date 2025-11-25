// src/pages/ClientForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaUser, FaSave, FaTimes } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './ClientForm.css';

function ClientForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        idNumber: '',
        phone: '',
        email: '',
        address: '',
        photoUrl: ''
    });
    const [uploading, setUploading] = useState(false);

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
        try {
            const response = await fetch(`${API_URL}/api/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('¡Cliente creado exitosamente!');
                navigate('/clients');
            } else {
                alert('Error al crear el cliente');
            }
        } catch (error) {
            console.error('Error saving client:', error);
            alert('Error de conexión');
        }
    };

    return (
        <div className="client-form-view">
            <h2 className="neon-title">NUEVO REGISTRO DE CLIENTE</h2>

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
                        <button type="submit" className="action-btn save">
                            <FaSave /> GUARDAR EN BASE DE DATOS
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
