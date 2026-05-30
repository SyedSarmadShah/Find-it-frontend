/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',
        paper: '#ffffff',
        background: '#F8FAFC',
        secondary: '#14532D',
        accent: '#22C55E',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(7, 17, 31, 0.16)',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
