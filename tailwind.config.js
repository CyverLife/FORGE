/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Zinc Scale (Pro 2026 Standard)
        'deep-black': '#09090b',      // Zinc 950 (was #0E0E0E)
        'card-black': '#18181b',      // Zinc 900 (was #1A1A1A)
        'border-subtle': '#27272a',   // Zinc 800 (was #2A2A2A)

        // FORGE Brand Colors (PRESERVED)
        'forge-red': '#C21F1F',
        'forge-orange': '#F97316',
        'forge-ember': '#EF4444',
        'forge-charcoal': '#1A1110',
        'forge-obsidian': '#0F0505',

        // Premium Grays
        'text-primary': '#FFFFFF',
        'text-secondary': '#A1A1A1',
        'text-tertiary': '#71717a',   // Zinc 500 (was #6B7280)
      },
      fontFamily: {
        // Display font for titles and numbers (Bold)
        'display': ['Inter_700Bold', 'Inter', 'system-ui', 'sans-serif'],
        // Body font for regular text
        'body': ['Inter_400Regular', 'Inter', 'system-ui', 'sans-serif'],
        // Label font for small text (Light)
        'label': ['Inter_300Light', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'premium': '20px',
      },
    },
  },
  plugins: [],
};
