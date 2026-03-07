/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./**/*.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#0A0E1A',
          surface: '#141827',
          'surface-light': '#1E2338',
          purple: '#9333EA',
          'purple-light': '#A855F7',
          'purple-glow': '#C084FC',
          cta: '#F59E0B',
          'cta-hover': '#FBBF24',
        },
      },
      animation: {
        'aurora': 'aurora 20s ease infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-in-up': 'fadeInUp 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
        'slide-in-right': 'slideInRight 0.6s ease forwards',
        'logo-scroll': 'logoScroll 30s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -20px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 15px) scale(0.9)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        logoScroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
