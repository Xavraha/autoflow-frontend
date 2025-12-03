// src/components/Sidebar.jsx
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaTasks, FaRobot, FaPlus } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            <Link to="/" className="logo-container">
                <h1 className="neon-logo">AUTO<span className="flow-text">FLOW</span></h1>
            </Link>

            <nav className="nav-menu">
                <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                    <FaTachometerAlt className="nav-icon" />
                    <span>DASHBOARD</span>
                </Link>

                <Link to="/clients" className={`nav-item ${isActive('/clients') ? 'active' : ''}`}>
                    <FaUsers className="nav-icon" />
                    <span>CLIENTES</span>
                </Link>

                <Link to="/new-task" className={`nav-item ${isActive('/new-task') ? 'active' : ''}`}>
                    <FaPlus className="nav-icon" />
                    <span>NUEVA TAREA</span>
                </Link>

                <Link to="/tasks" className={`nav-item ${isActive('/tasks') ? 'active' : ''}`}>
                    <FaTasks className="nav-icon" />
                    <span>TAREAS (Analytics)</span>
                </Link>

                <Link to="/technicians" className={`nav-item ${isActive('/technicians') ? 'active' : ''}`}>
                    <FaRobot className="nav-icon" />
                    <span>TÉCNICOS</span>
                </Link>
            </nav>
        </div>
    );
}

export default Sidebar;
