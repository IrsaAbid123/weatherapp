/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./component/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        playfairBold: ['PlayfairDisplay-BlackItalic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

