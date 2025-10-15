// src/components/Step.jsx
import { useState } from 'react';

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

  const handleUpload = async () => { /* ...tu función de subida no cambia... */ };
  const handleDeleteImage = async () => { /* ...tu función de borrado no cambia... */ };
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid #555', paddingLeft: '10px', marginBottom: '10px' }}>
      
      {/* --- EL MODAL (VISOR) CON ESTILOS MEJORADOS --- */}
      {isModalOpen && (
        <div 
          onClick={closeModal} // Fondo oscuro que cierra el modal
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
          }}
        >
          {/* Renderiza video o imagen con límites directos */}
          {isVideoUrl(step.photo_before) ? (
            <video 
              src={step.photo_before} 
              controls 
              autoPlay 
              onClick={(e) => e.stopPropagation()} // Evita que el clic en el video cierre el modal
              style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh' }} 
            />
          ) : (
            <img 
              src={step.photo_before} 
              alt="Vista ampliada" 
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'block', maxWidth: '90vw', maxHeight: '90vh' }} 
            />
          )}
          <button 
            onClick={closeModal} 
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer' }}
          >
            &times;
          </button>
        </div>
      )}

      {/* --- Contenido del componente (sin cambios funcionales) --- */}
      <p style={{ margin: '0' }}>- {step.description}</p>
      
      {isLoading ? (
        <p style={{ color: '#007bff' }}>Cargando...</p>
      ) : (
        <>
          {step.photo_before && (
            <div style={{ marginTop: '5px' }}>
              {isVideoUrl(step.photo_before) ? (
                <video src={step.photo_before} width="100" style={{ cursor: 'pointer' }} onClick={openModal} />
              ) : (
                <img src={step.photo_before} alt="Foto del antes" width="100" style={{ cursor: 'pointer' }} onClick={openModal} />
              )}
              <button onClick={handleDeleteImage} style={{ marginLeft: '10px', background: '#9d3e3e' }}>
                Borrar
              </button>
            </div>
          )}

          {!step.photo_before && (
            <div style={{ marginTop: '5px' }}>
              <input type="file" onChange={(e) => setFile(e.target.files[0])} />
              <button onClick={handleUpload} disabled={!file}>
                Subir Foto/Video "Antes"
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Step;