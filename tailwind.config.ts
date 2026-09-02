import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "cmyk-cyan": "#00e5ff",
        "cmyk-magenta": "#ff007f",
        "cmyk-yellow": "#ffe600",
        "cmyk-key": "#111111",
        "paper-white": "#fcfbf9",
        "paper-cream": "#f4efe6",
        "paper-dark": "#181818",
        "paper-border": "rgba(17, 17, 17, 0.12)",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-courier)", "Courier New", "monospace"],
      },
      boxShadow: {
        hard: "6px 6px 0px rgba(17, 17, 17, 0.9)",
        "hard-sm": "3px 3px 0px rgba(17, 17, 17, 0.9)",
        "hard-lg": "10px 10px 0px rgba(17, 17, 17, 0.9)",
        "hard-cyan": "6px 6px 0px #00e5ff",
        "hard-magenta": "6px 6px 0px #ff007f",
        "hard-yellow": "6px 6px 0px #ffe600",
      },
    },
  },
  plugins: [],
};
export default config;
