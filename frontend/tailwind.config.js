module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "#2a2a2a",
        background: "#0a0a0a",
        foreground: "#ffffff",
        ring: "#3b82f6", // 👈 ESSA LINHA É O QUE FALTAVA
      },
    },
  },
  plugins: [],
}