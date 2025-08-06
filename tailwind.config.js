/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: '#2C3E50',
        secondary: '#18BC9C',
        accent: '#F39C12',
        background: '#F4F8FB',
        muted: '#7F8C8D',
        error: '#E74C3C',
        success: '#27AE60',
      }
    },
  },
  plugins: [],
}