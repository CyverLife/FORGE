/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        magma: '#FF2E2E',
        obsidian: '#121212',
        smoke: '#1E1E1E', 
      },
    },
  },
  plugins: [],
}

