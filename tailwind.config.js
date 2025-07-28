// Importación del tipo de configuración de Tailwind (sólo para ayudar con el autocompletado)
/** @type {import('tailwindcss').Config} */

export default {
  // Define los archivos donde Tailwind buscará clases para generar el CSS
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      // Personalización de la paleta de colores del proyecto
      colors: {
        primary: "#337ab7", // Color principal usado para botones, encabezados, etc.
      },
    },
  },

  // Aquí se pueden añadir plugins adicionales si se necesitan (por ahora está vacío)
  plugins: [],
};
