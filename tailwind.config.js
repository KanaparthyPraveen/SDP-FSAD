/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#E54D2E',
          hover: '#FF6B4A',
          dim: 'rgba(229, 77, 46, 0.15)',
          border: 'rgba(229, 77, 46, 0.25)',
        },
        surface: {
          DEFAULT: '#0a0a0a',
          card: '#111111',
          card2: '#141414',
          elevated: '#1a1a1a',
        },
        border: {
          DEFAULT: '#1a1a1a',
          light: '#252525',
          subtle: 'rgba(255,255,255,0.06)',
        },
        text: {
          heading: '#ffffff',
          body: '#cccccc',
          muted: '#777777',
          dim: '#555555',
        },
        status: {
          green: '#22C55E',
          red: '#EF4444',
          yellow: '#F59E0B',
          blue: '#3B82F6',
          purple: '#A855F7',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.5)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.6)',
        glow: '0 0 20px rgba(229, 77, 46, 0.2)',
        'glow-sm': '0 0 10px rgba(229, 77, 46, 0.15)',
        modal: '0 25px 60px rgba(0,0,0,0.8)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(229,77,46,0.15)' },
          '50%': { boxShadow: '0 0 25px rgba(229,77,46,0.35)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}