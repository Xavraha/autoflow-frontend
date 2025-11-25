// src/pages/ClientList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser } from 'react-icons/fa';
import { API_URL } from '../apiConfig';
import './ClientList.css';

function ClientList() {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch(`${API_URL}/api/customers`);
            const data = await response.json();
            setClients(data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone?.includes(searchTerm) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="client-list-view">
            <div className="top-bar">
                <div className="search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search Client ID, Name, Phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Link to="/clients/new" className="neon-button">
                    NUEVO CLIENTE <FaPlus />
                </Link>
            </div>

            <div className="neon-table-container">
                <table className="neon-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NOMBRE COMPLETO</th>
                            <th>TELÉFONO</th>
                            <th>VEHÍCULOS</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredClients.map((client, index) => (
                            <tr key={client._id} className="client-row">
                                <td className="client-id">C-{index + 4521}</td> {/* Mock ID logic for now */}
                                <td>
                                    <div className="client-info">
                                        <div className="client-avatar-small">
                                            {client.photoUrl ? <img src={client.photoUrl} alt="avatar" /> : <FaUser />}
                                        </div>
                                        <span>{client.name}</span>
                                    </div>
                                </td>
                                <td>{client.phone}</td>
                                <td>{client.vehicles ? client.vehicles.length : 0} (Ver detalles)</td>
                                <td><span className="status-badge vip">VIP</span></td>
                                <td>
                                    <div className="actions">
                                        <button className="icon-btn edit"><FaEdit /> Edit</button>
                                        <button className="icon-btn delete"><FaTrash /> Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ClientList;
