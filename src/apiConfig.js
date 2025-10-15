// src/apiConfig.js

// Si la variable de entorno VITE_API_URL existe (en Vercel/Render), úsala.
// De lo contrario, usa la dirección local del backend.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';