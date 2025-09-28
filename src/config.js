// src/config.js
const savedApiUrl = localStorage.getItem("API_BASE_URL");

// Default fallback
const defaultApiUrl = "https://socks-theaters-shaft-kurt.trycloudflare.com";

const config = {
  API_BASE_URL: (savedApiUrl || defaultApiUrl).trim(),
};

export default config;