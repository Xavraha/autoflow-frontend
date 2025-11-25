import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaUserAstronaut, FaIdBadge, FaTools, FaBolt, FaTrash, FaEdit } from 'react-icons/fa';
import './TechnicianList.css';

const TechnicianList = () => {
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTechnicians();
    }, []);

    const fetchTechnicians = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/technicians`);
            if (response.ok) {
                const data = await response.json();
                setTechnicians(data);
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this technician?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/technicians/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    fetchTechnicians();
                }
            } catch (error) {
                console.error('Error deleting technician:', error);
            }
        }
    };

    if (loading) {
        return <div className="loading-screen">LOADING TECHNICIAN DATA...</div>;
    }

    return (
        <div className="technician-list-container">
            <div className="technician-header">
                <h1 className="neon-title">TECHNICIAN ROSTER</h1>
                <Link to="/technicians/new" className="neon-button create-btn">
                    <FaPlus /> RECRUIT NEW
                </Link>
            </div>

            <div className="technician-grid">
                {technicians.map((tech) => (
                    <div key={tech._id} className="technician-card">
                        <div className="card-header">
                            <span className={`status-indicator ${tech.status}`}></span>
                            <span className="tech-id">ID: {tech.idEmployee || 'N/A'}</span>
                        </div>

                        <div className="card-body">
                            <div className="avatar-container">
                                {tech.photoUrl ? (
                                    <img src={tech.photoUrl} alt={tech.name} className="tech-avatar" />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <FaUserAstronaut />
                                    </div>
                                )}
                                <div className="scan-line"></div>
                            </div>

                            <h2 className="tech-name">{tech.name}</h2>
                            <p className="tech-specialty"><FaTools /> {tech.specialty}</p>

                            <div className="tech-stats">
                                <div className="stat-item">
                                    <span className="stat-label">LVL</span>
                                    <span className="stat-value">{tech.level || '1'}</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-label">EFF</span>
                                    <span className="stat-value">{tech.stats?.efficiency || 0}%</span>
                                </div>
                            </div>
                        </div>

                        <div className="card-actions">
                            <Link to={`/technicians/${tech._id}`} className="action-btn edit-btn">
                                <FaEdit /> PROFILE
                            </Link>
                            <button onClick={() => handleDelete(tech._id)} className="action-btn delete-btn">
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TechnicianList;
