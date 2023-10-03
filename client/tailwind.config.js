/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary-50": "#f1f5f9",
        "primary-100": "#94a3b8",
        "primary-200": "#e2e8f0",
        "primary-300": "#475569",
        "primary-400": "#1e293b",
        "primary-500": "#0f172a",
        "secondary-100": "#fff",
        "sidebar-500": "#19282b",
      },
      borderColor: {
        "primary-50": "#f1f5f9",
        "primary-100": "#94a3b8",
        "primary-200": "#e2e8f0",
        "primary-300": "#475569",
        "primary-400": "#1e293b",
        "primary-500": "#0f172a",
      },
      textColor: {
        "primary-50": "#f1f5f9",
        "primary-100": "#94a3b8",
        "primary-200": "#e2e8f0",
        "primary-300": "#475569",
        "primary-400": "#1e293b",
        "primary-500": "#0f172a",
      },
      animation: {
        "pulse-custom": "pulse 1s",
      },
    },
  },
  plugins: [],
};
