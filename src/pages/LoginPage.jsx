// Importación de hooks y librerías necesarias
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

// Importación de imágenes y componentes
import logo from "../assets/logo.png";
import familyImage from "../assets/prehome-nueva-eps.jpg";
import UserModal from "../components/UserModal";

// Configuración del toast para mostrar notificaciones breves
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  customClass: {
    popup:
      "swal2-toast swal2-show bg-red-100 text-red-800 font-semibold rounded shadow",
  },
});

const LoginPage = () => {
  // Estados locales para formulario y errores
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showModal, setShowModal] = useState(false); // Mostrar/ocultar modal de registro

  const navigate = useNavigate(); // Hook de navegación

  // Función que maneja el envío del formulario de login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validaciones simples
    const emailValid = !!email.trim();
    const passwordValid = !!password.trim();
    setEmailError(!emailValid);
    setPasswordError(!passwordValid);

    if (!emailValid || !passwordValid) {
      // Mostrar error si faltan campos
      Toast.fire({
        icon: "error",
        title: "Correo y contraseña son obligatorios",
      });
      return;
    }

    try {
      // Envío de petición al backend para autenticación
      const response = await api.post("/auth/login", { email, password });

      // Guardado del token y usuario en localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Notificación de éxito y redirección
      Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/requests"); // Redireccionar a la vista principal
      });
    } catch (error) {
      // Manejo de errores del backend
      const message =
        error.response?.data?.message || "Error en el inicio de sesión";
      Toast.fire({
        icon: "error",
        title: message,
      });
    }
  };

  // Muestra el modal de registro
  const handleRegister = () => {
    setShowModal(true);
  };

  return (
    <>
      {/* Contenedor principal con diseño responsive */}
      <div className="flex h-screen">
        {/* Imagen a la izquierda solo visible en pantallas medianas o más grandes */}
        <div className="w-1/2 hidden md:block">
          <img
            src={familyImage}
            alt="familia"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Sección derecha: logo, formulario de login y botón de registro */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 md:px-20 bg-gray-50">
          {/* Logo */}
          <img src={logo} alt="logo" className="h-20 mb-8" />

          {/* Tarjeta del formulario */}
          <div className="bg-white shadow-xl p-8 rounded-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-primary mb-2">
              Bienvenido a NUEVA EPS
            </h2>
            <p className="text-sm text-center text-gray-500 mb-6">
              Ingresa tus credenciales para continuar
            </p>

            {/* Formulario de login */}
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(false); // Limpiar error al escribir
                }}
                className={`w-full px-4 py-3 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError(false); // Limpiar error al escribir
                }}
                className={`w-full px-4 py-3 border ${
                  passwordError ? "border-red-500" : "border-gray-300"
                } rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
              />
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded font-semibold hover:bg-blue-800 transition"
              >
                Entrar
              </button>
            </form>

            {/* Enlace para registrarse */}
            <div className="mt-6 text-center">
              <button
                onClick={handleRegister}
                className="text-primary hover:underline font-semibold"
              >
                ¿No tienes cuenta?{" "}
                <span className="font-semibold">Regístrate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de registro */}
      {showModal && (
        <UserModal
          userId={null} // Modo creación
          isOpen={true}
          onClose={() => setShowModal(false)} // Cierra el modal
          onSuccess={() => {
            setShowModal(false); // Cierra modal luego de registro exitoso
          }}
        />
      )}
    </>
  );
};

export default LoginPage;
