// src/Dashboard.jsx
import { FaCar, FaMoneyBillWave, FaClock, FaSmile } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const data = [
    { name: 'LUN', value: 20 },
    { name: 'MAR', value: 120 },
    { name: 'MIE', value: 130 },
    { name: 'JUE', value: 220 },
    { name: 'VIE', value: 190 },
    { name: 'SAB', value: 250 },
    { name: 'DOM', value: 310 },
];

const pieData = [
    { name: 'Truck', value: 20 },
    { name: 'Sedan', value: 45 },
    { name: 'SUV', value: 35 },
];

const COLORS = ['#00ff00', '#00f3ff', '#ff00ff'];

function Dashboard() {
    return (
        <div className="dashboard-view">
            <h2 className="page-title">Dashboard</h2>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card pink">
                    <div className="stat-icon"><FaMoneyBillWave /></div>
                    <div className="stat-info">
                        <h3>TOTAL INGRESOS (MES)</h3>
                        <p className="stat-value">€ 450,800 <span className="trend up">↑</span></p>
                    </div>
                </div>

                <div className="stat-card green">
                    <div className="stat-icon"><FaCar /></div>
                    <div className="stat-info">
                        <h3>VEHÍCULOS ENTREGADOS</h3>
                        <p className="stat-value">180</p>
                    </div>
                </div>

                <div className="stat-card blue">
                    <div className="stat-icon"><FaClock /></div>
                    <div className="stat-info">
                        <h3>TIEMPO PROMEDIO</h3>
                        <p className="stat-value">4H 15M</p>
                    </div>
                </div>

                <div className="stat-card purple">
                    <div className="stat-icon"><FaSmile /></div>
                    <div className="stat-info">
                        <h3>SATISFACCIÓN</h3>
                        <p className="stat-value">98%</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-container main-chart">
                    <h3>Weekly Volume</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#888" />
                                <YAxis stroke="#888" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #00f3ff' }}
                                    itemStyle={{ color: '#00f3ff' }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#00f3ff" strokeWidth={3} dot={{ r: 4, fill: '#00f3ff' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container pie-chart">
                    <h3>Vehicle Types</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="pie-legend">
                        {pieData.map((entry, index) => (
                            <div key={index} className="legend-item">
                                <span className="dot" style={{ backgroundColor: COLORS[index] }}></span>
                                <span>{entry.name} ({entry.value}%)</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="recent-activity">
                <h3>Recent Activity</h3>
                <ul className="activity-list">
                    <li>
                        <span className="time">[10:45]</span>
                        <span className="text">New Client Added: <span className="highlight">Maria Gonzalez (Audi Q5 2021)</span></span>
                    </li>
                    <li>
                        <span className="time">[11:12]</span>
                        <span className="text">Task Completed by Technician X: <span className="highlight">Brake Replacement (Ford F-150)</span></span>
                    </li>
                    <li>
                        <span className="time">[11:30]</span>
                        <span className="text">Diagnostic Started: <span className="highlight">Engine Fault (BMW X5)</span></span>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Dashboard;
