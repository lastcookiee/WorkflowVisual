import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#0f0f11",
          700: "#1a1a1f",
          500: "#2b2b33",
          300: "#d6d6de",
          100: "#f2f2f5"
        }
      },
      boxShadow: {
        ambient: "0 25px 50px -12px rgba(15, 15, 17, 0.45)",
        glow: "0 0 30px rgba(255, 255, 255, 0.12)"
      },
      animation: {
        pulseGlow: "pulseGlow 2s ease-in-out infinite"
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 rgba(255,255,255,0)" },
          "50%": { boxShadow: "0 0 24px rgba(255,255,255,0.35)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
