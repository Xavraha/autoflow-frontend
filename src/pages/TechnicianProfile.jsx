import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaUserAstronaut, FaTools, FaEdit, FaTrash, FaArrowLeft, FaMicrochip, FaBolt, FaChartLine } from 'react-icons/fa';
import './TechnicianProfile.css';

const TechnicianProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [technician, setTechnician] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTechnician();
    }, [id]);

    const fetchTechnician = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/technicians`);
            if (response.ok) {
                const data = await response.json();
                const tech = data.find(t => t._id === id);
                if (tech) {
                    setTechnician(tech);
                } else {
                    alert('Technician not found');
                    navigate('/technicians');
                }
            }
        } catch (error) {
            console.error('Error fetching technician:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('WARNING: DELETING OPERATIVE RECORD. THIS ACTION IS IRREVERSIBLE. PROCEED?')) {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/technicians/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    navigate('/technicians');
                }
            } catch (error) {
                console.error('Error deleting technician:', error);
            }
        }
    };

    if (loading) return <div className="loading-screen">ACCESSING BIOMETRIC DATABASE...</div>;
    if (!technician) return null;

    // Calculate dummy stats if not present (for demo purposes)
    const efficiency = technician.stats?.efficiency || Math.floor(Math.random() * 20) + 80;
    const speed = technician.stats?.speed || Math.floor(Math.random() * 30) + 70;
    const accuracy = technician.stats?.accuracy || Math.floor(Math.random() * 10) + 90;

    return (
        <div className="tech-profile-container">
            <div className="profile-header">
                <button onClick={() => navigate('/technicians')} className="back-btn">
                    <FaArrowLeft /> ROSTER
                </button>
                <h1 className="neon-title">OPERATIVE PROFILE</h1>
            </div>

            <div className="profile-content">
                {/* Left Column: Identity */}
                <div className="identity-card">
                    <div className="profile-avatar-container">
                        {technician.photoUrl ? (
                            <img src={technician.photoUrl} alt={technician.name} className="profile-avatar" />
                        ) : (
                            <div className="avatar-placeholder" style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                                <FaUserAstronaut size={60} color="#555" />
                            </div>
                        )}
                        <div className="scan-overlay"></div>
                    </div>

                    <h2 className="tech-name-large">{technician.name}</h2>
                    <p className="tech-role">{technician.specialty?.toUpperCase()}</p>

                    <div className="id-badge">
                        ID: {technician.idEmployee || 'UNKNOWN'}
                    </div>

                    <div className="action-buttons" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
                        <Link to={`/technicians/edit/${technician._id}`} className="edit-btn">
                            <FaEdit /> EDIT
                        </Link>
                        <button onClick={handleDelete} className="delete-btn">
                            <FaTrash />
                        </button>
                    </div>
                </div>

                {/* Right Column: Stats & Skills */}
                <div className="details-column">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <h3><FaBolt /> EFFICIENCY</h3>
                            <div className="gauge-container" style={{ '--percentage': `${efficiency}%` }}>
                                <div className="gauge-inner">{efficiency}%</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <h3><FaChartLine /> SPEED</h3>
                            <div className="gauge-container" style={{ '--percentage': `${speed}%` }}>
                                <div className="gauge-inner">{speed}%</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <h3><FaMicrochip /> ACCURACY</h3>
                            <div className="gauge-container" style={{ '--percentage': `${accuracy}%` }}>
                                <div className="gauge-inner">{accuracy}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="skills-section">
                        <h2><FaTools /> SKILL MATRIX</h2>
                        <div className="skills-list">
                            {technician.skills && Object.entries(technician.skills).map(([skill, hasSkill]) => (
                                hasSkill && (
                                    <div key={skill} className="skill-tag">
                                        {skill.toUpperCase()}
                                    </div>
                                )
                            ))}
                            {(!technician.skills || !Object.values(technician.skills).some(Boolean)) && (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>NO SPECIALIZED SKILLS RECORDED</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TechnicianProfile;
