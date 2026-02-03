import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // or "selector" in newer Tailwind versions
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
export default config;