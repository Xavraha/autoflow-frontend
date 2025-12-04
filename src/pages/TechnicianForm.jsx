import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaUserAstronaut, FaIdCard, FaTools, FaSave, FaArrowLeft, FaBolt, FaMicrochip } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './TechnicianForm.css';

const TechnicianForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        name: '',
        idEmployee: '',
        specialty: '',
        level: '1',
        photoUrl: '',
        status: 'available',
        skills: {
            mechanics: false,
            electronics: false,
            software: false,
            bodywork: false,
            painting: false
        }
    });

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (isEditMode) {
            fetchTechnician();
        }
    }, [id]);

    const fetchTechnician = async () => {
        try {
            const response = await fetch(`${API_URL}/api/technicians`);
            if (response.ok) {
                const technicians = await response.json();
                const tech = technicians.find(t => t._id === id);
                if (tech) {
                    setFormData(tech);
                }
            }
        } catch (error) {
            console.error('Error fetching technician:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillChange = (skill) => {
        setFormData(prev => ({
            ...prev,
            skills: {
                ...prev.skills,
                [skill]: !prev.skills[skill]
            }
        }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        try {
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formDataUpload,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, photoUrl: data.url }));
            } else {
                alert('Error uploading image');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const url = isEditMode
            ? `${API_URL}/api/technicians/${id}`
            : `${API_URL}/api/technicians`;

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                navigate('/technicians');
            } else {
                const data = await response.json();
                alert(`Error saving technician: ${data.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error saving technician:', error);
            alert(`Error saving technician: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="tech-form-container">
            <div className="form-header">
                <button onClick={() => navigate('/technicians')} className="back-btn">
                    <FaArrowLeft /> BACK
                </button>
                <h1 className="neon-title">
                    {isEditMode ? 'MODIFY BIOMETRICS' : 'NEW OPERATIVE REGISTRATION'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="tech-form">
                <div className="form-grid">
                    {/* Left Column: Identity & Photo */}
                    <div className="form-column identity-column">
                        <h2 className="section-title"><FaIdCard /> IDENTITY</h2>

                        <div className="photo-upload-section">
                            <div className={`hex-preview ${uploading ? 'scanning' : ''}`}>
                                {formData.photoUrl ? (
                                    <img src={formData.photoUrl} alt="Preview" className="preview-img" />
                                ) : (
                                    <FaUserAstronaut className="placeholder-icon" />
                                )}
                                <div className="hex-border"></div>
                            </div>
                            <label className="upload-btn">
                                {uploading ? 'SCANNING...' : 'UPLOAD NEURO-IMAGE'}
                                <input type="file" onChange={handleFileChange} accept="image/*" hidden />
                            </label>
                        </div>

                        <div className="input-group">
                            <label>OPERATIVE NAME</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="neon-input"
                                placeholder="ENTER NAME"
                            />
                        </div>

                        <div className="input-group">
                            <label>ID BADGE NUMBER</label>
                            <input
                                type="text"
                                name="idEmployee"
                                value={formData.idEmployee}
                                onChange={handleChange}
                                required
                                className="neon-input"
                                placeholder="XXX-XXX"
                            />
                        </div>
                    </div>

                    {/* Right Column: Skills & Specs */}
                    <div className="form-column specs-column">
                        <h2 className="section-title"><FaMicrochip /> SPECIFICATIONS</h2>

                        <div className="input-group">
                            <label>PRIMARY SPECIALTY</label>
                            <select
                                name="specialty"
                                value={formData.specialty}
                                onChange={handleChange}
                                className="neon-select"
                            >
                                <option value="">SELECT SPECIALTY</option>
                                <option value="Mechanic">MECHANIC</option>
                                <option value="Electrician">ELECTRICIAN</option>
                                <option value="Software">SOFTWARE ENGINEER</option>
                                <option value="Bodywork">BODYWORK SPECIALIST</option>
                            </select>
                        </div>

                        <div className="input-group">
                            <label>CLEARANCE LEVEL</label>
                            <div className="level-selector">
                                {[1, 2, 3, 4, 5].map(lvl => (
                                    <button
                                        key={lvl}
                                        type="button"
                                        className={`level-btn ${formData.level == lvl ? 'active' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, level: lvl }))}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="skills-matrix">
                            <label>SKILLS MATRIX</label>
                            <div className="skills-grid">
                                {Object.keys(formData.skills).map(skill => (
                                    <button
                                        key={skill}
                                        type="button"
                                        className={`skill-toggle ${formData.skills[skill] ? 'active' : ''}`}
                                        onClick={() => handleSkillChange(skill)}
                                    >
                                        <span className="skill-check"></span>
                                        {skill.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="save-btn" disabled={loading}>
                        <FaSave /> {loading ? 'PROCESSING...' : 'INITIALIZE OPERATIVE'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TechnicianForm;
