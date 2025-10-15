// src/components/VinScanner.jsx
import { useZxing } from "react-zxing";

function VinScanner({ onVinScan, onClose }) {
  const { ref } = useZxing({
    onResult(result) {
      onVinScan(result.getText());
    },
    // Le indicamos a la librería que busque códigos de barras 1D (como los VIN)
    formats: ["code_128", "ean_13", "ean_8", "code_39"],
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: 100 }}>
      <video ref={ref} style={{ width: '100%', height: '100%' }} />
      <button 
        onClick={onClose} 
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 101, padding: '10px' }}
      >
        Cerrar
      </button>
    </div>
  );
}

export default VinScanner;