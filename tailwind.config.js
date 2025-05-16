/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['Montserrat', 'sans-serif'],
        heading: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        gold: '#c7ad84',
      },
      backgroundColor: {
        gold: '#c7ad84',
      },
      borderColor: {
        gold: '#c7ad84',
      },
      textColor: {
        gold: '#c7ad84',
      },
    },
  },
  plugins: [],
};