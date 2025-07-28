// Importa StrictMode para ayudar a detectar problemas potenciales en la aplicación React
import { StrictMode } from "react";

// Importa la función para crear el root de la app en React 18+
import { createRoot } from "react-dom/client";

// Importa los estilos globales
import "./index.css";

// Importa el componente principal de la aplicación
import App from "./App.jsx";

// Monta la aplicación React dentro del elemento con id 'root'
createRoot(document.getElementById("root")).render(
  // StrictMode activa advertencias adicionales y verificaciones en desarrollo
  <StrictMode>
    <App />
  </StrictMode>
);
