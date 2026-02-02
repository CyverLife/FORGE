/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Premium Deep Blacks (Heroes Academy Style)
        'deep-black': '#0E0E0E',
        'card-black': '#1A1A1A',
        'border-subtle': '#2A2A2A',

        // Forge Brand Colors
        'forge-red': '#C21F1F',
        'forge-orange': '#F97316',
        'forge-ember': '#EF4444',
        'forge-charcoal': '#1A1110',
        'forge-obsidian': '#0F0505',

        // Premium Grays
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1A1',
        'text-tertiary': '#6B7280',
      },
      fontFamily: {
        // Display font for titles
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'premium': '20px',
      },
    },
  },
  plugins: [],
};
