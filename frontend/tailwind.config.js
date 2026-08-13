/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nixieCream: "#FDF8E3",
        nixieCard: "#FFFFFF",
        nixieCyan: "#5EE6E6",
        nixieCyanDark: "#3FCFCF",
        nixieText: "#111111",
        nixieGray: "#9CA3AF",
      },
      fontFamily: {
        nixie: ["Poppins", "system-ui", "sans-serif"],
      },
      borderRadius: {
        nixie: "1rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "70%": { opacity: "1", transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
        popIn: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};
