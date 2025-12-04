import { useZxing } from "react-zxing";

function VinScanner({ onVinScan, onClose }) {
  const { ref } = useZxing({
    onResult(result) {
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
      "data_matrix"
    ],
  });

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'black', zIndex: 100 }}>
      <video ref={ref} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <button
        onClick={onClose}
        style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 101, padding: '10px', background: '#f00', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Cerrar
      </button>
      <button
        style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 101, padding: '15px 30px', background: '#00f3ff', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem' }}
        onClick={() => {
          const manualCode = prompt("Ingresa el código manualmente:");
          if (manualCode) {
            onVinScan(manualCode);
          }
        }}
      >
        ESCANEAR
      </button>
    </div>
  );
}

export default VinScanner;