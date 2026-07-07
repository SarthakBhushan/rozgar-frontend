/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f4f8',
          100: '#d9e4ee',
          500: '#2563a8',
          600: '#1e4f8a',
          700: '#1A3C5E',
          800: '#122840',
          900: '#0c1c2e',
        },
        ember: {
          50:  '#fff4f0',
          100: '#ffe4d9',
          400: '#f07040',
          500: '#E8572A',
          600: '#C94520',
          700: '#a33418',
        },
        warm: '#F7F6F4',
        stone: '#E8E6E2',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
}
