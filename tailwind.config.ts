import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        porcelain: "#faf8f1",
        ink: "#1f2933",
        graphite: "#3f4652",
        gold: {
          50: "#fff8df",
          100: "#f9e8a9",
          300: "#d7ad35",
          500: "#a97913",
          700: "#74520c"
        },
        mint: "#2f9e8f",
        river: "#286f9b",
        clay: "#b7654a"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(31, 41, 51, 0.08)",
        line: "0 1px 0 rgba(31, 41, 51, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
