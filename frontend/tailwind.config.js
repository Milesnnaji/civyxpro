/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
      },
      colors: {
        bg: '#0A0B14',
        card: '#12141F',
        elevated: '#1A1D2E',
        accent: '#6C63FF',
        'accent-glow': '#4F46E5',
        'accent-light': '#A5A0FF',
        teal: '#00D4AA',
        gold: '#F5C542',
        danger: '#FF5B5B',
        muted: '#7B7A9D',
        dim: '#3E3D5C',
        border: '#1E2035',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s ease',
        float: 'float 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
    },
  },
  plugins: [],
}
