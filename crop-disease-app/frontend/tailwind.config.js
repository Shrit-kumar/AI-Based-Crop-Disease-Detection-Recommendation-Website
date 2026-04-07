/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#10B981', // Emerald 500 - Vibrant and modern
                secondary: '#34D399', // Emerald 400
                accent: '#F59E0B', // Amber 500
                dark: {
                    DEFAULT: '#0F172A', // Slate 900
                    paper: '#1E293B', // Slate 800
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
