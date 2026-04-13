/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18222f",
        canvas: "#f6f1e8",
        clay: "#e9dcc7",
        ember: "#b75d38",
        moss: "#73896b",
        lake: "#537a8a",
      },
      fontFamily: {
        sans: ['"Noto Sans JP"', '"Hiragino Sans"', "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(24, 34, 47, 0.08)",
      },
    },
  },
  plugins: [],
};
