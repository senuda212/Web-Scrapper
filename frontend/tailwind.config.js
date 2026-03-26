/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0a0e1a",
        surface: "#0f1629",
        elevated: "#151d35",
        overlay: "#1a2540",
        border: "#1e2d4a",
        "border-active": "#2a3f6a",
        "text-primary": "#e8edf5",
        "text-secondary": "#8a9ab8",
        "text-muted": "#4a5a78",
        blue: "#1e6fff",
        green: "#00d084",
        "green-muted": "#0a2a1e",
        red: "#ff3b5c",
        "red-muted": "#2a0a12",
        yellow: "#ffb800",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        ui: ["Inter", "sans-serif"],
      },
      boxShadow: {
        green: "0 0 40px rgba(0, 208, 132, 0.15)",
        red: "0 8px 18px rgba(255, 59, 92, 0.14)",
        blue: "0 0 40px rgba(30, 111, 255, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
}
