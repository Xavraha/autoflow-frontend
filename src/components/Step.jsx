// src/components/Step.jsx
import { useState } from 'react';
import { API_URL } from './apiConfig'; // Importamos la URL correcta

// Función para detectar si la URL es de un video
const isVideoUrl = (url) => {
  if (!url) return false;
  const videoExtensions = ['.mp4', '.mov', '.webm', '.ogg'];
  return videoExtensions.some(ext => url.toLowerCase().includes(ext));
};

function Step({ job, task, step, onUpdate }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- LÓGICA DE SUBIDA (CORREGIDA Y COMPLETA) ---
  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadRes = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Error en Cloudinary');
      
      const imageUrl = uploadData.url;

      await fetch(`${API_URL}/api/jobs/${job._id}/tasks/${task._id}/steps/${step._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photo_before: imageUrl }),
      });

      alert('¡Archivo subido y guardado!');
      setFile(null);
      onUpdate();
    } catch (error) {
      console.error('Error en el proceso de subida:', error);
      alert(`Hubo un error al subir el archivo: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // --- LÓGICA DE BORRADO (CORREGIDA Y COMPLETA) ---
  const handleDeleteImage = async () => {
    if (window.confirm('¿Estás seguro de que quieres borrar este archivo?')) {
      setIsLoading(true);
      try {
        await fetch(`${API_URL}/api/jobs/${job._id}/tasks/${task._id}/steps/${step._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ photo_before: null }),
        });
        alert('¡Archivo borrado!');
        onUpdate();
      } catch (error) {
        console.error('Error al borrar el archivo:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // =========================================================================
  // --- EL RETURN COMPLETO (LA PARTE QUE FALTABA) ---
  // =========================================================================
  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid var(--border-color)', paddingLeft: '10px', marginBottom: '10px' }}>
      {isModalOpen && (
        <div onClick={closeModal} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          {isVideoUrl(step.photo_before) ? (
            <video src={step.photo_before} controls autoPlay onClick={(e) => e.stopPropagation()} style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh' }} />
          ) : (
            <img src={step.photo_before} alt="Vista ampliada" onClick={(e) => e.stopPropagation()} style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh' }} />
          )}
          <button onClick={closeModal} style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer' }}>&times;</button>
        </div>
      )}

      <p style={{ margin: '0' }}>- {step.description}</p>
      
      {isLoading ? (
        <p style={{ color: 'var(--primary-blue)' }}>Procesando archivo, por favor espera...</p>
      ) : (
        <>
          {step.photo_before ? ( // Si existe un archivo, muestra la miniatura y el botón de borrar
            <div style={{ marginTop: '5px' }}>
              {isVideoUrl(step.photo_before) ? (
                <video src={step.photo_before} width="120" style={{ cursor: 'pointer', borderRadius: '4px' }} onClick={openModal} />
              ) : (
                <img src={step.photo_before} alt="Foto del antes" width="120" style={{ cursor: 'pointer', borderRadius: '4px' }} onClick={openModal} />
              )}
              <button onClick={handleDeleteImage} style={{ marginLeft: '10px', background: '#9d3e3e' }}>Borrar</button>
            </div>
          ) : ( // Si NO existe un archivo, muestra el formulario de subida
            <div style={{ marginTop: '5px' }}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleUpload} disabled={!file}>Subir Foto/Video "Antes"</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Step;