/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0F1419',
        surface: '#1A1E2E',
        neon: {
          blue: '#3B82F6',
          purple: '#A855F7',
          pink: '#EC4899',
          green: '#10B981',
          orange: '#F97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
