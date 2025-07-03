/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'royal': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'sith': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        'dark': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#000000',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'robot-hover': 'robotHover 4s ease-in-out infinite',
      },
      backgroundImage: {
        'galactic-gradient': 'linear-gradient(135deg, #000000 0%, #1e3a8a 30%, #000000 70%, #450a0a 100%)',
        'royal-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
        'sith-gradient': 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #450a0a 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(37, 99, 235, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(37, 99, 235, 0.8), 0 0 30px rgba(37, 99, 235, 0.4)' },
        },
        robotHover: {
          '0%, 100%': { transform: 'translateY(0px) rotateY(0deg)' },
          '25%': { transform: 'translateY(-10px) rotateY(5deg)' },
          '50%': { transform: 'translateY(-5px) rotateY(0deg)' },
          '75%': { transform: 'translateY(-15px) rotateY(-5deg)' },
        },
      },
    },
  },
  plugins: [],
};