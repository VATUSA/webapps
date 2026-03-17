import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vatusaBlue: "#1E3A8A",
        vatusaRed: "#B91C1C",
      },
    },
  },
  plugins: [],
};

export default config;
