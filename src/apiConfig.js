// src/apiConfig.js

// Si la variable de entorno VITE_API_URL existe (en Vercel/Render), úsala.
// Si estamos en localhost, usa localhost:3000.
// Si estamos en producción pero no hay variable, asume que el backend está en la misma URL (relative path).
export const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:3000' : '');