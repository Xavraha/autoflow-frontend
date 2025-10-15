// src/components/AddJobForm.jsx
import { useState } from 'react';
import VinScanner from './VinScanner';
import { API_URL } from './apiConfig';

function AddJobForm({ customers, onJobAdded }) {
  // --- Estados para toda la información ---
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [trim, setTrim] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [engineCylinders, setEngineCylinders] = useState('');
  const [fuelType, setFuelType] = useState('');
  
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [technician, setTechnician] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const [isScannerOpen, setScannerOpen] = useState(false);

  const handleVinScan = async (vin) => {
    setScannerOpen(false);
    alert(`VIN Escaneado: ${vin}. Buscando información...`);
    try {
      const response = await fetch(`${API_URL}/api/vehicle-info/${vin}`);
      if (!response.ok) throw new Error('VIN no encontrado en la base de datos de NHTSA.');
      
      const data = await response.json();
      
      // Auto-rellenamos todos los campos con la información obtenida
      setMake(data.make || '');
      setModel(data.model || '');
      setYear(data.year || '');
      setVehicleType(data.vehicleType || '');
      setEngineCylinders(data.engineCylinders || '');
      setFuelType(data.fuelType || '');

    } catch (error) {
      alert(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCustomerId || !make || !model || !year || !taskTitle) {
      alert('Por favor, completa al menos el cliente, vehículo y título de la tarea.');
      return;
    }

    const newJob = {
      customerId: selectedCustomerId,
      vehicleInfo: {
        make, model, year: parseInt(year) || null, trim,
        // --- Añadimos los nuevos campos al objeto que se envía ---
        vehicleType, engineCylinders, fuelType
      },
      taskInfo: {
        title: taskTitle,
        technician: technician,
        description: taskDescription
      }
    };

    try {
      await fetch(`${API_URL}/api/jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      // Limpiamos todo el formulario
      setMake(''); setModel(''); setYear(''); setTrim('');
      setVehicleType(''); setEngineCylinders(''); setFuelType('');
      setSelectedCustomerId('');
      setTaskTitle(''); setTechnician(''); setTaskDescription('');
      
      onJobAdded();
      alert('¡Trabajo añadido exitosamente!');
    } catch (error) {
      console.error('Error al añadir trabajo:', error);
    }
  };

  const selectedCustomer = customers.find(c => c._id === selectedCustomerId);

  return (
    <div>
      {isScannerOpen && <VinScanner onVinScan={handleVinScan} onClose={() => setScannerOpen(false)} />}
      
      <h3>Añadir Nuevo Trabajo</h3>
      <form onSubmit={handleSubmit}>
        {/* --- SECCIÓN DE CLIENTE (RESTAURADA) --- */}
        <h4>1. Selecciona el Cliente</h4>
        <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
          <option value="">-- Elige un cliente --</option>
          {customers.map(customer => (
            <option key={customer._id} value={customer._id}>{customer.name}</option>
          ))}
        </select>
        {selectedCustomer && <p><strong>Teléfono:</strong> {selectedCustomer.phone}</p>}
        
        {/* --- SECCIÓN DE VEHÍCULO (MEJORADA) --- */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h4 style={{ marginTop: '20px' }}>2. Información del Vehículo</h4>
          {/* Botón de escaneo pequeño */}
          <button type="button" onClick={() => setScannerOpen(true)} style={{ height: '30px', marginTop: '15px' }}>
            📷 Escanear
          </button>
        </div>

        <input type="text" placeholder="Marca" value={make} onChange={e => setMake(e.target.value)} />
        <input type="text" placeholder="Modelo" value={model} onChange={e => setModel(e.target.value)} />
        <input type="text" placeholder="Año" value={year} onChange={e => setYear(e.target.value)} />
        <input type="text" placeholder="Nivel de Equipamiento (Trim)" value={trim} onChange={e => setTrim(e.target.value)} />
        <input type="text" placeholder="Tipo de Vehículo (ej. SUV)" value={vehicleType} onChange={e => setVehicleType(e.target.value)} />
        <input type="text" placeholder="Cilindros del Motor (ej. 4)" value={engineCylinders} onChange={e => setEngineCylinders(e.target.value)} />
        <input type="text" placeholder="Tipo de Combustible (ej. Gasolina)" value={fuelType} onChange={e => setFuelType(e.target.value)} />
        
        {/* --- SECCIÓN DE TAREA (RESTAURADA) --- */}
        <h4 style={{ marginTop: '20px' }}>3. Tarea Inicial</h4>
        <input type="text" placeholder="Título de la Tarea" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
        <input type="text" placeholder="Técnico Asignado" value={technician} onChange={e => setTechnician(e.target.value)} />
        <textarea
          placeholder="Descripción del problema reportado..."
          value={taskDescription}
          onChange={e => setTaskDescription(e.target.value)}
          style={{ width: '100%', marginTop: '5px', minHeight: '60px' }}
        />
        
        <button type="submit" style={{ marginTop: '20px', width: '100%' }}>Añadir Trabajo</button>
      </form>
    </div>
  );
}

export default AddJobForm;