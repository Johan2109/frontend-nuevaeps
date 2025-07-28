// Importa la librería axios para hacer peticiones HTTP
import axios from "axios";

// Crea una instancia de axios con una URL base para las peticiones a la API
const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api", // URL base de la API backend en Laravel
});

// Interceptor que se ejecuta antes de cada petición
api.interceptors.request.use((config) => {
  // Obtiene el token almacenado en localStorage
  const token = localStorage.getItem("token");

  // Si existe el token, lo agrega en el encabezado Authorization
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Retorna la configuración modificada
  return config;
});

// Exporta la instancia de axios para usarla en todo el proyecto
export default api;
