Frontend - Solicitudes de Medicamentos 🍆💊

Este es el frontend del sistema de gestión de solicitudes de medicamentos desarrollado con React, TailwindCSS y React Router, que se comunica con un backend en Laravel y utiliza PostgreSQL como base de datos. Está diseñado para permitir a los usuarios autenticados crear, visualizar y gestionar solicitudes de medicamentos, incluyendo medicamentos NO POS con campos adicionales obligatorios.

🚀 Tecnologías utilizadas

React

Vite

TailwindCSS

React Router

React Icons

SweetAlert2

Axios

📆 Instalación

git clone https://github.com/tu_usuario/frontend-nuevaeps.git
cd frontend-nuevaeps
npm install
npm run dev

Asegúrate de tener el backend corriendo y accesible desde el archivo src/services/api.js.

🧹 Estructura del proyecto

src/
├── assets/ # Imágenes como el logo institucional
├── components/ # Componentes reutilizables como el modal de solicitud
│ └── RequestModal.jsx
│ └── UserModal.jsx
├── pages/ # Páginas principales
│ ├── LoginPage.jsx
│ └── RequestsPage.jsx
├── services/ # Configuración de axios para API
│ └── api.js
├── App.jsx # Configuración de rutas
├── main.jsx # Punto de entrada de React
└── index.css # Estilos globales con Tailwind

🔐 Autenticación

Autenticación mediante email y password

Almacena token y user en localStorage

Redirección protegida a rutas si no hay sesión activa

Previene retroceso a login después del logout

🧾 Funcionalidades principales

🔐 Login de usuarios con validación

📋 Listado paginado de solicitudes personales

➕ Creación de nueva solicitud mediante un modal

👁️ Vista detallada de cada solicitud

📌 Si el medicamento es NO POS, se solicitan:

Número de orden médica

Dirección

Teléfono

Correo electrónico

✅ Validaciones en todos los campos obligatorios

🚪 Cerrar sesión con confirmación

📄 Ejemplo de solicitud

{
"medicine_id": 2,
"order_number": "ORD-4556",
"address": "Calle 123 #45-67",
"phone": "3110000000",
"email": "paciente@ejemplo.com"
}

🎨 Diseño UI

Estilo limpio y profesional usando TailwindCSS

Iconografía con react-icons (FontAwesome)

Comportamiento responsive para distintos tamaños de pantalla

📈 Vista previa

Agrega tus capturas de pantalla reales en la carpeta src/assets y actualiza las rutas si es necesario.

🧑 Autor

Johan Ronaldo López Montes

💼 Desarrollo Frontend en React

¡Listo para producción y extensible para más módulos! ⚙️
