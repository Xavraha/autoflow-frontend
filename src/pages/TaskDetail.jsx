import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaTasks, FaEdit, FaArrowLeft, FaCog } from 'react-icons/fa';
import './TaskDetail.css';

const TaskDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobDetail();
    }, [id]);

    const fetchJobDetail = async () => {
        try {
            // Fetch job
            const jobResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}`);
            if (jobResponse.ok) {
                const jobData = await jobResponse.json();
                setJob(jobData);

                // Fetch customer
                if (jobData.customerId) {
                    const customersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`);
                    if (customersResponse.ok) {
                        const customers = await customersResponse.json();
                        const customerData = customers.find(c => c._id === jobData.customerId);
                        setCustomer(customerData);
                    }
                }
            } else {
                alert('Job not found');
                navigate('/tasks');
            }
        } catch (error) {
            console.error('Error fetching job:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                setJob(prev => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return <div className="loading-screen">ACCESSING MISSION DATA...</div>;
    }

    if (!job) {
        return <div className="loading-screen">MISSION NOT FOUND</div>;
    }

    return (
        <div className="taskdetail-container">
            <div className="taskdetail-header">
                <div>
                    <button
                        onClick={() => navigate('/tasks')}
                        className="back-btn"
                        style={{
                            marginBottom: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(0,0,0,0.5)',
                            border: '1px solid #00f3ff',
                            color: '#00f3ff',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        <FaArrowLeft /> BACK TO MISSIONS
                    </button>
                    <h1>MISSION BRIEF</h1>
                </div>
                <span className={`status-badge ${job.status}`}>
                    {job.status.replace(/_/g, ' ')}
                </span>
            </div>

            <div className="taskdetail-content">
                {/* Main Content */}
                <div className="main-section">
                    {/* Vehicle Info */}
                    <div className="info-card">
                        <h2><FaCar /> VEHICLE DATA</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <label>Make</label>
                                <div className="value">{job.vehicleInfo?.make || 'N/A'}</div>
                            </div>
                            <div className="info-item">
                                <label>Model</label>
                                <div className="value">{job.vehicleInfo?.model || 'N/A'}</div>
                            </div>
                            <div className="info-item">
                                <label>Year</label>
                                <div className="value">{job.vehicleInfo?.year || 'N/A'}</div>
                            </div>
                            <div className="info-item">
                                <label>Fuel Type</label>
                                <div className="value">{job.vehicleInfo?.fuelType || 'N/A'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    {customer && (
                        <div className="info-card">
                            <h2><FaUser /> CLIENT DATA</h2>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Name</label>
                                    <div className="value">{customer.name}</div>
                                </div>
                                <div className="info-item">
                                    <label>Phone</label>
                                    <div className="value">{customer.phone}</div>
                                </div>
                                {customer.email && (
                                    <div className="info-item">
                                        <label>Email</label>
                                        <div className="value">{customer.email}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tasks/Steps */}
                    <div className="info-card">
                        <h2><FaTasks /> MISSION TASKS</h2>
                        {job.tasks && job.tasks.length > 0 ? (
                            job.tasks.map((task, index) => (
                                <div key={task._id || index} style={{ marginBottom: '2rem' }}>
                                    <h3 style={{ color: '#00f3ff', marginBottom: '1rem' }}>{task.title}</h3>
                                    {task.description && (
                                        <p style={{ color: '#aaa', marginBottom: '1rem' }}>{task.description}</p>
                                    )}
                                    {task.technician && (
                                        <p style={{ color: '#ff00ff', marginBottom: '1rem' }}>
                                            Assigned: {task.technician}
                                        </p>
                                    )}

                                    {task.steps && task.steps.length > 0 && (
                                        <div className="task-steps">
                                            <h4 style={{ color: '#999', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                                STEPS COMPLETED
                                            </h4>
                                            {task.steps.map((step, stepIndex) => (
                                                <div key={step._id || stepIndex} className="step-item">
                                                    <div className="step-description">{step.description}</div>
                                                    {(step.photo_before || step.photo_after) && (
                                                        <div className="step-photos">
                                                            {step.photo_before && (
                                                                <div className="step-photo">
                                                                    <img src={step.photo_before} alt="Before" />
                                                                    <span className="photo-label">BEFORE</span>
                                                                </div>
                                                            )}
                                                            {step.photo_after && (
                                                                <div className="step-photo">
                                                                    <img src={step.photo_after} alt="After" />
                                                                    <span className="photo-label">AFTER</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>No tasks assigned yet</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="sidebar">
                    <div className="action-panel">
                        <h3>ACTIONS</h3>
                        <button className="action-btn btn-primary">
                            <FaEdit /> EDIT MISSION
                        </button>
                        <button className="action-btn btn-secondary">
                            <FaCog /> ADD TASK
                        </button>

                        <div className="status-changer">
                            <label>Change Status</label>
                            <select
                                value={job.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                <option value="pending_diagnosis">Pending Diagnosis</option>
                                <option value="awaiting_parts">Awaiting Parts</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="canceled">Canceled</option>
                            </select>
                        </div>
                    </div>

                    <div className="action-panel">
                        <h3>MISSION INFO</h3>
                        <div className="info-item" style={{ marginBottom: '1rem' }}>
                            <label>Created</label>
                            <div className="value">
                                {new Date(job.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="info-item">
                            <label>Mission ID</label>
                            <div className="value" style={{ fontSize: '0.8rem' }}>
                                {job._id}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetail;
