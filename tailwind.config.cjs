/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "base": "#34aae0",
        "light-base": "#92D6D7",
      },
    },
  },
  plugins: [],
}
