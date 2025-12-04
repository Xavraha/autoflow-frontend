import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCar, FaUser, FaTasks, FaSave, FaArrowLeft, FaSearch } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './NewTask.css';

const NewTask = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(false);
    const [decodingVin, setDecodingVin] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        customerId: '',
        vin: '',
        vehicleInfo: {
            make: '',
            model: '',
            year: '',
            manufacturer: '',
            vehicleType: '',
            engineCylinders: '',
            fuelType: '',
            transmission: '',
            displacementL: '',
            trim: ''
        },
        taskInfo: {
            title: '',
            description: '',
            technician: ''
        }
    });

    useEffect(() => {
        fetchCustomers();
        fetchTechnicians();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/customers`);
            if (response.ok) {
                const data = await response.json();
                setCustomers(data);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const fetchTechnicians = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/technicians`);
            if (response.ok) {
                const data = await response.json();
                setTechnicians(data);
            }
        } catch (error) {
            console.error('Error fetching technicians:', error);
        }
    };

    const handleVinDecode = async () => {
        if (!formData.vin || formData.vin.length !== 17) {
            setError('VIN must be exactly 17 characters');
            return;
        }

        setDecodingVin(true);
        setError('');

        try {
            const response = await fetch(`${API_URL}/api/vehicle-info/${formData.vin}`);
            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({
                    ...prev,
                    vehicleInfo: {
                        make: data.make || '',
                        model: data.model || '',
                        year: data.year || '',
                        manufacturer: data.manufacturer || '',
                        vehicleType: data.vehicleType || '',
                        engineCylinders: data.engineCylinders || '',
                        fuelType: data.fuelType || '',
                        transmission: data.transmission || '',
                        displacementL: data.displacementL || '',
                        trim: data.trim || ''
                    }
                }));
            } else {
                setError('Could not decode VIN. Please enter vehicle info manually.');
            }
        } catch (error) {
            console.error('Error decoding VIN:', error);
            setError('Error decoding VIN. Please try again.');
        } finally {
            setDecodingVin(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('vehicle.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                vehicleInfo: { ...prev.vehicleInfo, [field]: value }
            }));
        } else if (name.startsWith('task.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                taskInfo: { ...prev.taskInfo, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                vehicleInfo: {
                    ...formData.vehicleInfo,
                    vin: formData.vin
                }
            };

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                navigate('/tasks');
            } else {
                setError('Error creating task. Please try again.');
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setError('Error creating task. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="newtask-container">
            <div className="newtask-header">
                <button onClick={() => navigate('/tasks')} className="back-btn" style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: 'rgba(0,0,0,0.5)', border: '1px solid #00f3ff', color: '#00f3ff', borderRadius: '4px', cursor: 'pointer' }}>
                    <FaArrowLeft /> BACK TO TASKS
                </button>
                <h1>NEW MISSION PROTOCOL</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="newtask-form">
                {/* Customer Section */}
                <div className="form-section">
                    <h2><FaUser /> CLIENT DATA</h2>
                    <div className="form-group">
                        <label>SELECT CLIENT *</label>
                        <select
                            name="customerId"
                            value={formData.customerId}
                            onChange={handleChange}
                            className="form-control"
                            required
                        >
                            <option value="">-- SELECT CLIENT --</option>
                            {customers.map(customer => (
                                <option key={customer._id} value={customer._id}>
                                    {customer.name} - {customer.phone}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Vehicle Section */}
                <div className="form-section full-width">
                    <h2><FaCar /> VEHICLE IDENTIFICATION</h2>

                    <div className="vin-decoder-group">
                        <div className="form-group">
                            <label>VIN CODE</label>
                            <input
                                type="text"
                                name="vin"
                                value={formData.vin}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Enter 17-character VIN"
                                maxLength="17"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleVinDecode}
                            className="decode-btn"
                            disabled={decodingVin || !formData.vin}
                        >
                            {decodingVin ? (
                                <>
                                    <div className="loading-spinner"></div>
                                    DECODING...
                                </>
                            ) : (
                                <>
                                    <FaSearch /> DECODE VIN
                                </>
                            )}
                        </button>
                    </div>

                    <div className="vehicle-info-grid" style={{ marginTop: '1.5rem' }}>
                        <div className="form-group">
                            <label>MAKE</label>
                            <input
                                type="text"
                                name="vehicle.make"
                                value={formData.vehicleInfo.make}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g., Toyota"
                            />
                        </div>
                        <div className="form-group">
                            <label>MODEL</label>
                            <input
                                type="text"
                                name="vehicle.model"
                                value={formData.vehicleInfo.model}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g., Camry"
                            />
                        </div>
                        <div className="form-group">
                            <label>YEAR</label>
                            <input
                                type="text"
                                name="vehicle.year"
                                value={formData.vehicleInfo.year}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g., 2020"
                            />
                        </div>
                        <div className="form-group">
                            <label>FUEL TYPE</label>
                            <input
                                type="text"
                                name="vehicle.fuelType"
                                value={formData.vehicleInfo.fuelType}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g., Gasoline"
                            />
                        </div>
                    </div>
                </div>

                {/* Task Section */}
                <div className="form-section full-width">
                    <h2><FaTasks /> MISSION DETAILS</h2>

                    <div className="form-group">
                        <label>MISSION TITLE *</label>
                        <input
                            type="text"
                            name="task.title"
                            value={formData.taskInfo.title}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="e.g., Oil Change & Brake Inspection"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>DESCRIPTION</label>
                        <textarea
                            name="task.description"
                            value={formData.taskInfo.description}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Detailed description of the work required..."
                        />
                    </div>

                    <div className="form-group">
                        <label>ASSIGNED OPERATIVE</label>
                        <select
                            name="task.technician"
                            value={formData.taskInfo.technician}
                            onChange={handleChange}
                            className="form-control"
                        >
                            <option value="">-- ASSIGN LATER --</option>
                            {technicians.map(tech => (
                                <option key={tech._id} value={tech.name}>
                                    {tech.name} - {tech.specialty}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/tasks')} className="btn-cancel">
                        CANCEL
                    </button>
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? (
                            <>
                                <div className="loading-spinner"></div>
                                CREATING...
                            </>
                        ) : (
                            <>
                                <FaSave /> CREATE MISSION
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewTask;
