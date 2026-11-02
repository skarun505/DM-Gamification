import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#4F46E5",
          hover: "#4338CA",
          light: "#EEF2FF",
          dark: "#3730A3",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#ECFDF5",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        rose: {
          DEFAULT: "#F43F5E",
          light: "#FFF1F2",
        },
        canvas: "#FAF8F5",
      },
      fontFamily: {
        heading: ["var(--font-fredoka)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        card: "0 8px 30px -4px rgba(79, 70, 229, 0.08)",
        glow: "0 0 25px -5px rgba(79, 70, 229, 0.3)",
      },
    },
  },
  plugins: [],
};
export default config;

