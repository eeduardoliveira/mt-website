import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        "off-white": "#faf9f7",
        light: "#f4f2ef",
        ink: "#1a1916",
        "ink-muted": "rgba(26,25,22,0.5)",
        gold: "#b8924a",
        "gold-light": "#d4aa68",
        "gold-pale": "#f3ead8",
        border: "rgba(0,0,0,0.08)",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-montserrat)", "Helvetica", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
      },
    },
  },
  plugins: [typography],
};
export default config;
