/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        nixieCream: "#FFFDF0",
        nixieCard: "#FFFFFF",
        nixieCyan: "#45B8B6",
        nixieCyanDark: "#289F9D",
        nixieText: "#1A202C",
        nixieGray: "#718096",
        nixieYellow: "#F5A623",
      },
      fontFamily: {
        nixieHeading: ['"DM Sans"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        nixieBody: ['"Golos Text"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        nixie: ['"Golos Text"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        nixie: "1rem",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(-32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(32px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.6)" },
          "70%": { opacity: "1", transform: "scale(1.08)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseRing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.2)", opacity: "0.2" },
        },
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(16px) scale(0.95)" },
          "60%": { opacity: "1", transform: "translateY(-4px) scale(1.02)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        stagger1: {
          "0%, 10%": { opacity: "0", transform: "translateY(14px)" },
          "30%, 100%": { opacity: "1", transform: "translateY(0)" },
        },
        stagger2: {
          "0%, 25%": { opacity: "0", transform: "translateY(14px)" },
          "45%, 100%": { opacity: "1", transform: "translateY(0)" },
        },
        stagger3: {
          "0%, 40%": { opacity: "0", transform: "translateY(14px)" },
          "60%, 100%": { opacity: "1", transform: "translateY(0)" },
        },
        stagger4: {
          "0%, 55%": { opacity: "0", transform: "translateY(14px)" },
          "75%, 100%": { opacity: "1", transform: "translateY(0)" },
        },
        spinSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        msgFade: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "15%, 85%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(-6px)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.45s ease-out both",
        slideUp: "slideUp 0.5s ease-out both",
        slideLeft: "slideLeft 0.55s ease-out both",
        slideRight: "slideRight 0.55s ease-out both",
        popIn: "popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        pulseRing: "pulseRing 1.8s ease-in-out infinite",
        floatUp: "floatUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both",
        stagger1: "stagger1 0.9s ease-out both",
        stagger2: "stagger2 0.9s ease-out both",
        stagger3: "stagger3 0.9s ease-out both",
        stagger4: "stagger4 1s ease-out both",
        spinSlow: "spinSlow 2.4s linear infinite",
        breathe: "breathe 3s ease-in-out infinite",
        msgFade: "msgFade 2.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
