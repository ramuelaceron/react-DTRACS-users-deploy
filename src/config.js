// src/config.js
const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 
                "http://localhost:8000", // fallback for local dev
};

export default config;