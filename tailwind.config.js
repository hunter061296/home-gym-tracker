/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gym: {
          teal: '#0F6E56',
          tealdark: '#0a5240',
          teallight: '#14b8a6',
        },
      },
    },
  },
  plugins: [],
}
