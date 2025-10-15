// src/components/AddCustomerForm.jsx
import { API_URL } from './apiConfig';
import { useState } from 'react';

function AddCustomerForm({ onCustomerAdded }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const newCustomer = { name, phone };

    try {
      await fetch(`${API_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      // Limpiamos los campos del formulario
      setName('');
      setPhone('');
      
      // Avisamos al componente padre que se añadió un cliente para que refresque la lista
      onCustomerAdded(); 
      alert('¡Cliente añadido exitosamente!');

    } catch (error) {
      console.error('Error al añadir cliente:', error);
      alert('Hubo un error al añadir el cliente.');
    }
  };

  return (
    <div>
      <h3>Añadir Nuevo Cliente</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del Cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Guardar Cliente</button>
      </form>
    </div>
  );
}

export default AddCustomerForm;