/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          purple: '#D946EF',
          magenta: '#E91E63',
          blue: '#00BCD4',
        },
        dark: {
          bg: '#0A0B1E',
          surface: '#1A1B2E',
          deep: '#050510',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // We might want to add a Google Font link later
      },
    },
  },
  plugins: [],
}
