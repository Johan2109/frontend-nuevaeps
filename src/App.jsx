// Importamos los componentes necesarios de React Router
import {
  BrowserRouter as Router, // Router principal que maneja la navegación en el navegador
  Routes, // Contenedor de todas las rutas
  Route, // Componente para definir una ruta específica
  Navigate, // Componente para redireccionar a otra ruta
} from "react-router-dom";

// Importamos las páginas del sistema
import LoginPage from "./pages/LoginPage"; // Vista de login
import RequestsPage from "./pages/RequestsPage"; // Vista principal de solicitudes
import PrivateRoute from "./components/PrivateRoute"; // Componente que protege rutas privadas

function App() {
  // Verifica si el usuario está autenticado consultando si hay un token en localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* Ruta para el login */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              // Si ya está autenticado, redirecciona automáticamente a /requests
              <Navigate to="/requests" replace />
            ) : (
              // Si no está autenticado, muestra el formulario de login
              <LoginPage />
            )
          }
        />

        {/* Ruta protegida que requiere autenticación */}
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <RequestsPage />
            </PrivateRoute>
          }
        />

        {/* Cualquier otra ruta redirecciona al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
