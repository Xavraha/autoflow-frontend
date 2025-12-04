import { useZxing } from "react-zxing";

function VinScanner({ onVinScan, onClose }) {
  const { ref } = useZxing({
    onResult(result) {
      // Automatically called when a barcode is detected
      onVinScan(result.getText());
    },
    formats: [
      "code_128",
      "ean_13",
      "ean_8",
      "code_39",
      "code_93",
      "codabar",
      "itf",
      "rss_14",
      "pdf417",
      "aztec",
      "data_matrix",
      "qr_code"
    ],
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: 100 }}>
      <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

      {/* Scanning indicator overlay */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '250px',
        height: '150px',
        border: '3px solid #00f3ff',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 243, 255, 0.5)',
        pointerEvents: 'none'
      }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00f3ff, transparent)',
          animation: 'scanLine 2s infinite'
        }} />
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 10%; }
          50% { top: 90%; }
          100% { top: 10%; }
        }
      `}</style>

      {/* Instructions text */}
      <div style={{
        position: 'absolute',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#00f3ff',
        fontWeight: 'bold',
        textAlign: 'center',
        textShadow: '0 0 10px rgba(0, 243, 255, 0.5)'
      }}>
        Apunta la cámara al código de barras
      </div>

      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 101,
          padding: '10px 20px',
          background: '#f00',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Cerrar
      </button>
    </div>
  );
}

export default VinScanner;