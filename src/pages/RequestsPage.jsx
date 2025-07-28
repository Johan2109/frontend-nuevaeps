// Importaciones necesarias de React, navegación, alertas y otros componentes
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/logo.png";
import RequestModal from "../components/RequestModal";
import api from "../services/api";
import { FaEye, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Componente principal para la gestión de solicitudes del usuario
const RequestsPage = () => {
  // Estados para el usuario, solicitudes, modal y paginación
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const navigate = useNavigate();

  // useEffect que se ejecuta al montar el componente para cargar el usuario y sus solicitudes
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchRequests(1, parsedUser.id);
    }
  }, []);

  // Función para obtener las solicitudes desde la API
  const fetchRequests = async (page = 1, userId = null) => {
    try {
      const response = await api.get(
        `/requests?page=${page}&user_id=${userId}`
      );
      console.log("Fetched requests:", response.data);
      setRequests(response.data.data);
      setPagination({
        currentPage: response.data.current_page,
        lastPage: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las solicitudes", "error");
    }
  };

  // Cambiar de página en la paginación
  const handlePageChange = (page) => {
    if (
      page !== pagination.currentPage &&
      page > 0 &&
      page <= pagination.lastPage
    ) {
      fetchRequests(page, user.id);
    }
  };

  // Cerrar sesión con confirmación de SweetAlert
  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Tu sesión se cerrará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#337ab7",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "rounded-lg shadow-xl",
        title: "text-xl font-bold text-gray-800",
        htmlContainer: "text-gray-600",
        confirmButton: "font-semibold",
        cancelButton: "font-semibold",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    });
  };

  // Abrir modal para crear nueva solicitud
  const openNewRequestModal = () => {
    setSelectedRequest({
      medicine_id: "",
      order_number: "",
      email: "",
      phone: "",
      address: "",
    });
    setModalMode("create");
    setShowModal(true);
  };

  // Abrir modal en modo visualización para una solicitud existente
  const openViewRequestModal = (request) => {
    setSelectedRequest(request);
    setModalMode("view");
    setShowModal(true);
  };

  // Renderizado principal
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Encabezado con logo, saludo al usuario y botón de cerrar sesión */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6 grid grid-cols-3 items-center">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="h-12" />
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">
            Bienvenido{user?.name ? `, ${user.name}` : ""}
          </h1>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Contenedor de solicitudes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-primary">
            Tus solicitudes
          </h2>
          <button
            onClick={openNewRequestModal}
            className="bg-primary hover:bg-primary/80 text-white font-semibold px-4 py-2 rounded-lg transition"
          >
            + Nueva Solicitud
          </button>
        </div>

        {/* Mostrar mensaje si no hay solicitudes */}
        {requests.length === 0 ? (
          <p className="text-gray-600">
            Aún no tienes solicitudes registradas.
          </p>
        ) : (
          <>
            {/* Tabla de solicitudes */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border">
                <thead className="bg-gray-100 text-gray-700 font-semibold">
                  <tr>
                    <th className="p-2 border text-center">#</th>
                    <th className="p-2 border text-center">Medicamento</th>
                    <th className="p-2 border text-center">¿NO POS?</th>
                    <th className="p-2 border text-center">N° Orden</th>
                    <th className="p-2 border text-center">Correo</th>
                    <th className="p-2 border text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req, index) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="p-2 border">
                        {(pagination.currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="p-2 border">{req.medicine?.name}</td>
                      <td className="p-2 border text-center">
                        {req.medicine?.is_no_pos ? "Sí" : "No"}
                      </td>
                      <td className="p-2 border">{req.order_number || "-"}</td>
                      <td className="p-2 border">{req.email || "-"}</td>
                      <td className="p-2 border text-center">
                        <button
                          onClick={() => openViewRequestModal(req)}
                          className="text-primary hover:text-blue-700 transition"
                          title="Ver solicitud"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginación */}
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                <FaChevronLeft />
              </button>
              <span className="text-gray-700">
                Página {pagination.currentPage} de {pagination.lastPage}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.lastPage}
                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                <FaChevronRight />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Modal reutilizable para ver o crear solicitudes */}
      <RequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={modalMode}
        requestData={selectedRequest}
        onSuccess={() => {
          setShowModal(false);
          fetchRequests(pagination.currentPage, user.id);
        }}
      />
    </div>
  );
};

export default RequestsPage;
