/** @type {import('tailwindcss').Config} */
export default {
 content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This is the crucial line
  ],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          '50%': { opacity: '.5' },
        }
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

