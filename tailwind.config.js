/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'blue': {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          900: '#111827',
        }
      },
    },
  },
  plugins: [],
}