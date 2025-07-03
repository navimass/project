/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Orbitron', 'sans-serif'],
        'body': ['Exo 2', 'sans-serif'],
      },
      colors: {
        'violet': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
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
        'float': 'float 4s ease-in-out infinite',
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 3s infinite',
        'glass-pulse': 'glassPulse 3s infinite',
        'gradient-shift': 'hyperRealisticGradient 20s ease infinite',
        'particle-float': 'particleFloat 6s ease-in-out infinite',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'violet-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 50%, #a855f7 100%)',
        'royal-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1d4ed8 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg)',
            filter: 'brightness(1)',
          },
          '50%': { 
            transform: 'translateY(-12px) rotate(1deg)',
            filter: 'brightness(1.1)',
          },
        },
        floatSlow: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg) scale(1)',
            filter: 'brightness(1) hue-rotate(0deg)',
          },
          '50%': { 
            transform: 'translateY(-18px) rotate(2deg) scale(1.05)',
            filter: 'brightness(1.15) hue-rotate(10deg)',
          },
        },
        glow: {
          '0%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.1)',
          },
          '100%': { 
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.3), 0 0 120px rgba(59, 130, 246, 0.2)',
          },
        },
        shimmer: {
          '0%': { 
            backgroundPosition: '-200% 0',
            opacity: '0',
          },
          '50%': {
            opacity: '1',
          },
          '100%': { 
            backgroundPosition: '200% 0',
            opacity: '0',
          },
        },
        glassPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(139, 92, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 80px rgba(139, 92, 246, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.3)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)',
          },
        },
        hyperRealisticGradient: {
          '0%, 100%': { 
            backgroundPosition: '0% 50%, 0% 50%, 0% 50%, 0% 50%',
            filter: 'hue-rotate(0deg) brightness(1)',
          },
          '25%': { 
            backgroundPosition: '100% 50%, 50% 100%, 25% 75%, 0% 50%',
            filter: 'hue-rotate(15deg) brightness(1.1)',
          },
          '50%': { 
            backgroundPosition: '100% 100%, 100% 50%, 50% 50%, 0% 50%',
            filter: 'hue-rotate(30deg) brightness(1.05)',
          },
          '75%': { 
            backgroundPosition: '50% 100%, 100% 100%, 75% 25%, 0% 50%',
            filter: 'hue-rotate(15deg) brightness(1.1)',
          },
        },
        particleFloat: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px) scale(1)',
            opacity: '0.3',
          },
          '50%': {
            transform: 'translateY(-20px) translateX(10px) scale(1.2)',
            opacity: '0.8',
          },
        },
      },
    },
  },
  plugins: [],
};