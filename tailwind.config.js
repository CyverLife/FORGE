/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // The Void (Backgrounds)
        'obsidian-void': '#050505',   // Deepest black, absence of light
        'obsidian-plate': '#131313',  // Solid matter, cards
        'obsidian-shard': '#222222',  // Fragments, borders, heavy strokes

        // Molten Core (Brand/Action)
        'molten-core': '#FF3B00',     // The heart of the forge (Primary)
        'molten-magma': '#C21F1F',    // Cooling edge (Secondary)
        'molten-glow': '#FF9500',     // Heat radiation (Highlight)

        // Cold Steel (Inactive/Structure)
        'cold-steel': '#C0C5CE',      // Raw material
        'cold-slate': '#1F1F1F',      // Unworked metal

        // Ethereal (Effects)
        'ethereal-haze': 'rgba(64, 64, 64, 0.2)', // Steam, smoke
        'starlight': '#E0F7FA',       // Mastery, transcendence

        // Semantic Aliases (Legacy Support -> New System)
        'deep-black': '#050505',      // -> obsidian-void
        'card-black': '#131313',      // -> obsidian-plate
        'border-subtle': '#222222',   // -> obsidian-shard
        'forge-red': '#FF3B00',       // -> molten-core (redefined for vibrance)
        'text-primary': '#FFFFFF',
        'text-secondary': '#C0C5CE',  // -> cold-steel
        'text-tertiary': '#6B7280',
      },
      fontFamily: {
        'display': ['Inter_700Bold', 'Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter_400Regular', 'Inter', 'system-ui', 'sans-serif'],
        'label': ['Inter_300Light', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'premium': '20px',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.8s ease-out forwards',
        'pulse-slow': 'pulse-slow 3s infinite',
      },
    },
  },
  plugins: [],
};
