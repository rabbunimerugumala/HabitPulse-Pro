/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020312',
        surface: '#050816',
        primary: '#3B82F6',
        primaryAlt: '#A855F7',
        accent: '#7B337E',
        muted: '#9CA3AF',
        border: 'rgba(255,255,255,0.08)',
        success: '#22C55E',
        warning: '#F97316',
        danger: '#F97316', // mapping danger to orange/warning per request
        neon: {
          blue: '#3B82F6',
          purple: '#A855F7',
          pink: '#EC4899', // keeping distinct pink
          green: '#22C55E', // mapping to success
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
