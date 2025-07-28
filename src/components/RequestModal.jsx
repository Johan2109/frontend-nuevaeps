// Importación de hooks y librerías
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import api from "../services/api";

// Componente del modal de solicitud
const RequestModal = ({
  isOpen, // Estado para saber si el modal está abierto
  onClose, // Función para cerrar el modal
  mode = "create", // Modo del modal: "create" o "view"
  requestData = {}, // Datos de la solicitud (cuando está en modo "view")
  onSuccess, // Función callback que se ejecuta al guardar correctamente
}) => {
  // Estado para lista de medicamentos desde API
  const [medicines, setMedicines] = useState([]);
  const [medicineId, setMedicineId] = useState("");
  const [isNoPos, setIsNoPos] = useState(false);

  // Estados para los campos extra si el medicamento es NO POS
  const [orderNumber, setOrderNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Determina si el modal está en modo solo lectura
  const isViewMode = mode === "view";

  // Carga la lista de medicamentos al iniciar el componente
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const { data } = await api.get("/medicines");
        setMedicines(data);
      } catch {
        Swal.fire("Error", "Error al cargar medicamentos", "error");
      }
    };
    fetchMedicines();
  }, []);

  // Rellena los datos si el modal se abre en modo view
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "view" && requestData) {
      setMedicineId(requestData.medicine?.id?.toString() || "");
      setIsNoPos(requestData.medicine?.is_no_pos || false);
      setOrderNumber(requestData.order_number || "");
      setAddress(requestData.address || "");
      setPhone(requestData.phone || "");
      setEmail(requestData.email || "");
    }

    // Limpia los datos si es modo creación
    if (mode === "create") {
      setMedicineId("");
      setIsNoPos(false);
      setOrderNumber("");
      setAddress("");
      setPhone("");
      setEmail("");
    }
  }, [isOpen, mode, requestData]);

  // Maneja cambio de medicamento seleccionado
  const handleMedicineChange = (e) => {
    const selectedId = e.target.value;
    setMedicineId(selectedId);
    const selected = medicines.find((m) => m.id.toString() === selectedId);
    setIsNoPos(selected?.is_no_pos || false);
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación: debe seleccionar un medicamento
    if (!medicineId) {
      Swal.fire("Error", "Seleccione un medicamento", "error");
      return;
    }

    // Validación de campos obligatorios si es NO POS
    if (
      isNoPos &&
      (!orderNumber.trim() || !address.trim() || !phone.trim() || !email.trim())
    ) {
      Swal.fire("Error", "Complete todos los campos obligatorios", "error");
      return;
    }

    try {
      // Envía la solicitud al backend
      await api.post("/requests", {
        medicine_id: medicineId,
        order_number: isNoPos ? orderNumber : null,
        address: isNoPos ? address : null,
        phone: isNoPos ? phone : null,
        email: isNoPos ? email : null,
      });

      Swal.fire("Éxito", "Solicitud registrada", "success");
      onSuccess?.(); // Llama callback si existe
      onClose(); // Cierra el modal
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Error al guardar",
        "error"
      );
    }
  };

  // Si el modal no está abierto, no renderizar nada
  if (!isOpen) return null;

  // Render del modal
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl animate-fade-in">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="h-14" />
        </div>

        {/* Título */}
        <h2 className="text-xl font-semibold text-center text-primary mb-4">
          {isViewMode ? "Detalle de Solicitud" : "Nueva Solicitud"}
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select de medicamento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medicamento
            </label>
            <select
              value={medicineId}
              onChange={handleMedicineChange}
              disabled={isViewMode}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Seleccione...</option>
              {medicines.map((med) => (
                <option key={med.id} value={med.id}>
                  {med.name}
                </option>
              ))}
            </select>
          </div>

          {/* Campos extra si el medicamento es NO POS */}
          {isNoPos && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de orden
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Número de orden"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Dirección"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Teléfono"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isViewMode}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Correo"
                />
              </div>
            </>
          )}

          {/* Botones de acción */}
          <div className="flex justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              {isViewMode ? "Cerrar" : "Cancelar"}
            </button>

            {/* Botón de guardar solo si no está en modo solo lectura */}
            {!isViewMode && (
              <button
                type="submit"
                className="px-5 py-2 bg-primary text-white rounded hover:bg-primary/80"
              >
                Guardar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Exportación del componente
export default RequestModal;
