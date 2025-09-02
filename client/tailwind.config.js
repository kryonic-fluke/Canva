/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          "50%": { opacity: ".5" },
        },
        spin: {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        "pulse-cyan": {
          "0%, 100%": {
            opacity: 1,
            backgroundColor: "#06b6d4",
          },
          "50%": {
            opacity: 0.6,
            backgroundColor: "#67e8f9",
          },
        }, 
        "impulse-fuchsia": {
          "0%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 #d946ef",
          },
          "70%": {
            transform: "scale(1.1)",
            boxShadow: "0 0 0 10px rgba(217, 70, 239, 0)",
          },
          "100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0 rgba(217, 70, 239, 0)",
          },
        },
      },
      animation: {
                spin: 'spin 1s linear infinite',

        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-cyan": "pulse-cyan 2s cubic-bezier(0.4, 0, 0.6, 1) infinite", // New 'impulse-fuchsia' animation
        "impulse-fuchsia": "impulse-fuchsia 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};
