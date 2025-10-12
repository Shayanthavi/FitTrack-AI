/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0EA5E9',
        secondary: '#E2E8F0',
        accent: '#F0F9FF',
        // FitTrack AI Modern Color Palette
        fitness: {
          primary: '#6366F1', // Vibrant Indigo
          secondary: '#8B5CF6', // Purple
          success: '#10B981', // Emerald Green
          warning: '#F59E0B', // Amber
          danger: '#EF4444', // Red
          info: '#3B82F6', // Blue
          light: '#F9FAFB', // Light Gray
          dark: '#1F2937', // Dark Gray
        },
        venus: {
          violet: '#4F2FFB',
          lightViolet: '#B1A7F8',
          blue: '#4361EE',
          green: '#19E387',
          pink: '#F2647D',
          yellow: '#FFD600',
          silver: '#C0C0C0',
          bg: '#F8FAFF',
          gray: '#E5E7EB',
          shadow: '#E9EAF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
}

