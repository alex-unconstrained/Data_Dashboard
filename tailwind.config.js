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
        primary: {
          DEFAULT: '#2563EB', // Primary Blue
          600: '#1D4ED8',     // Darker Shade
          700: '#1E40AF',     // Even Darker Shade
        },
        secondary: {
          DEFAULT: '#10B981', // Secondary Green
          600: '#059669',     // Darker Shade
          700: '#047857',     // Even Darker Shade
        },
        accent: {
          DEFAULT: '#F59E0B', // Accent Amber
          600: '#D97706',     // Darker Shade
          700: '#B45309',     // Even Darker Shade
        },
        warning: {
          DEFAULT: '#EF4444', // Warning Red
          600: '#DC2626',     // Darker Shade
          700: '#B91C1C',     // Even Darker Shade
        },
        background: '#F9FAFB', // Light Gray Background
        text: '#1F2937',       // Dark Gray Text
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
}