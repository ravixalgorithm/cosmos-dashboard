/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          'space': ['Space Grotesk', 'system-ui', 'sans-serif'],
        },
        colors: {
          'space-purple': '#6366f1',
          'space-blue': '#3b82f6',
          'space-dark': '#0f0f23',
        }
      },
    },
    plugins: [],
  }
