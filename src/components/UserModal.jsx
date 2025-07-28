// Importamos los hooks y librerías necesarias
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../services/api";
import logo from "../assets/logo.png";

// Configuración del toast de SweetAlert2 para mostrar notificaciones tipo "toast"
const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  customClass: {
    popup:
      "swal2-toast swal2-show bg-blue-100 text-blue-800 font-semibold rounded shadow",
  },
});

// Componente principal del modal de usuario
const UserModal = ({ isOpen, onClose, userId, onSuccess }) => {
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState({}); // Control de errores por campo

  // useEffect que carga la información del usuario si se está editando
  useEffect(() => {
    if (userId) {
      api.get(`/users/${userId}`).then((res) => {
        const { name, email } = res.data;
        setName(name);
        setEmail(email);
        setPassword("");
        setPasswordConfirmation("");
      });
    } else {
      // Si es un nuevo usuario, limpiamos los campos
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
    }
    setErrors({});
  }, [userId]);

  // Manejo del envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones de campos
    const newErrors = {};
    if (!name.trim()) newErrors.name = true;
    if (!email.trim()) newErrors.email = true;
    if (!userId && !password.trim()) newErrors.password = true;
    if (!userId && password !== passwordConfirmation)
      newErrors.passwordConfirmation = true;

    setErrors(newErrors);

    // Si hay errores, mostramos el toast y detenemos el envío
    if (Object.keys(newErrors).length > 0) {
      Toast.fire({
        icon: "error",
        title: "Verifica los campos del formulario",
      });
      return;
    }

    try {
      // Si hay userId, se actualiza el usuario
      if (userId) {
        await api.put(`/users/${userId}`, { name, email });
        Swal.fire(
          "Actualizado",
          "Usuario actualizado correctamente",
          "success"
        );
      } else {
        // Si no hay userId, se crea uno nuevo
        await api.post("/auth/register", {
          name,
          email,
          password,
          password_confirmation: passwordConfirmation,
        });
        Swal.fire("Creado", "Usuario creado correctamente", "success");
      }

      // Ejecutamos callbacks de éxito
      onSuccess();
      onClose();
    } catch (error) {
      Toast.fire({
        icon: "error",
        title: error.response?.data?.message || "Error al guardar usuario",
      });
    }
  };

  // Si el modal no está abierto, no renderizamos nada
  if (!isOpen) return null;

  return (
    // Fondo oscuro semi-transparente detrás del modal
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative animate-fade-in">
        {/* Logo en la parte superior */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-16" />
        </div>

        {/* Título del modal */}
        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          {userId ? "Editar Usuario" : "Crear Usuario"}
        </h2>

        {/* Formulario de creación/edición */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo nombre */}
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((prev) => ({ ...prev, name: false }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
            />
          </div>

          {/* Campo correo */}
          <div>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: false }));
              }}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-primary`}
            />
          </div>

          {/* Campos de contraseña solo si es creación */}
          {!userId && (
            <>
              {/* Contraseña */}
              <div>
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: false }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>

              {/* Confirmar contraseña */}
              <div>
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={passwordConfirmation}
                  onChange={(e) => {
                    setPasswordConfirmation(e.target.value);
                    setErrors((prev) => ({
                      ...prev,
                      passwordConfirmation: false,
                    }));
                  }}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.passwordConfirmation
                      ? "border-red-500"
                      : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary`}
                />
              </div>
            </>
          )}

          {/* Botones del modal */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-gray-300 text-gray-800 hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/80 transition"
            >
              {userId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Exportamos el componente
export default UserModal;
