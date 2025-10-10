// src/components/Step.jsx
import { useState } from 'react';

function Step({ job, task, step, onUpdate }) {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 1. Subir la imagen a Cloudinary
      const uploadRes = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // 2. Actualizar el paso en la base de datos con la nueva URL
      await fetch(`http://localhost:3000/api/jobs/${job._id}/tasks/${task._id}/steps/${step._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_before: imageUrl }),
      });

      alert('¡Imagen subida y guardada!');
      onUpdate(); // Refresca la lista de trabajos
      
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
    }
  };

  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid #555', paddingLeft: '10px' }}>
      <p> - {step.description}</p>
      {step.photo_before && <img src={step.photo_before} alt="Antes" width="100" />}
      
      <div>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Subir Foto "Antes"</button>
      </div>
    </div>
  );
}

export default Step;