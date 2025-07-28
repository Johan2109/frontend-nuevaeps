// Importa el componente Navigate de React Router
import { Navigate } from "react-router-dom";

// Componente de ruta privada que recibe hijos como prop
const PrivateRoute = ({ children }) => {
  // Obtiene el token de autenticación desde localStorage
  const token = localStorage.getItem("token");

  // Si hay token, renderiza los hijos; si no, redirige al login
  return token ? children : <Navigate to="/" replace />;
};

// Exporta el componente
export default PrivateRoute;
