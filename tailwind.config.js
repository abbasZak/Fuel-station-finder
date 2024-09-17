/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mygreen: '#1ea69a',
        hovermygreen: '#3bc5ba'
      }
    },
  },
  plugins: [],
}