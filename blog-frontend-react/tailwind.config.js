/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f6f5f3',
          100: '#e8e5df',
          200: '#d3cdc1',
          300: '#b3a992',
          400: '#8f8268',
          500: '#736652',
          600: '#5c5142',
          700: '#4a4136',
          800: '#332c25',
          900: '#211c17',
          950: '#14110d',
        },
        clay: {
          400: '#e08a5b',
          500: '#c76a3e',
          600: '#a8532f',
        },
        moss: {
          400: '#7f9c72',
          500: '#63805a',
          600: '#4d6446',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
