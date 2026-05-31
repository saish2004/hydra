/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#b9dbfe',
          300: '#7cc0fd',
          400: '#369ffa',
          500: '#0c83eb',
          600: '#0066cb',
          700: '#0251a3',
          800: '#074587',
          900: '#0c3b70',
          950: '#08254b',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
