/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        docs: {
          blue: '#1a73e8',
          hoverBlue: '#1557b0',
          bg: '#f8f9fa',
          toolbar: '#edf2fc',
          border: '#dadce0',
          darkText: '#202124',
          subtext: '#5f6368',
          sidebarBg: '#f9fbfd',
          canvasBg: '#f8f9fa'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'docs-card': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
        'docs-canvas': '0 1px 3px 1px rgba(60, 64, 67, 0.15), 0 1px 2px 0 rgba(60, 64, 67, 0.3)',
        'docs-toolbar': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
      }
    },
  },
  plugins: [],
}
