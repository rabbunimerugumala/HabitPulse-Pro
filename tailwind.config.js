/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'fireFlicker': 'fireFlicker 1.2s ease-in-out infinite',
            },
            keyframes: {
                fireFlicker: {
                    '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: '0.9',
                        filter: 'brightness(1) saturate(1)'
                    },
                    '25%': {
                        transform: 'scale(1.04)',
                        opacity: '1',
                        filter: 'brightness(1.15) saturate(1.2) hue-rotate(-5deg)'
                    },
                    '50%': {
                        transform: 'scale(1.06)',
                        opacity: '0.95',
                        filter: 'brightness(1.3) saturate(1.3) hue-rotate(0deg)'
                    },
                    '75%': {
                        transform: 'scale(1.03)',
                        opacity: '1',
                        filter: 'brightness(1.2) saturate(1.1) hue-rotate(5deg)'
                    }
                }
            },
            colors: {
                background: '#020312',
                surface: '#050816',
                primary: '#3B82F6',
                primaryAlt: '#A855F7',
                'primary-alt': '#A855F7',
                accent: '#7B337E',
                muted: '#9CA3AF',
                border: 'rgba(255,255,255,0.1)',
                success: '#22C55E',
                warning: '#F59E0B',
                danger: '#F97316',
                'fire-glow': 'rgba(251, 146, 60, 0.6)',
                neon: {
                    blue: '#3B82F6',
                    purple: '#A855F7',
                    pink: '#EC4899',
                    green: '#22C55E',
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
