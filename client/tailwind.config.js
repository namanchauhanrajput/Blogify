/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-10%) scale(0.98)", opacity: "0" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.25s ease-out forwards",
      },
    },
  },
  plugins: [],
};
