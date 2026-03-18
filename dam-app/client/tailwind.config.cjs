/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./test.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            colors: {
                dark: {
                    900: '#0d1117',
                    800: '#161b22',
                    700: '#21262d',
                },
                neon: {
                    green: '#2ea043',
                    blue: '#58a6ff',
                    purple: '#bc8cff',
                }
            }
        },
    },
    plugins: [],
}
