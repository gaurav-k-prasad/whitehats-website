/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The core electric blue from the typography and cube
        'cyber-blue': '#0088FF', 
        // Lighter variant for hovers and intense glows
        'cyber-blue-light': '#33A9FF', 
        // Deep slate/navy for the main background (much better than pure #000)
        'bg-main': '#030712', 
        // Slightly lighter tint for the repository cards
        'card-bg': '#0B1120', 
        // Subtle blue-grey for card borders
        'card-border': '#1E293B', 
        // Muted text for descriptions to ensure good contrast without being harsh white
        'text-muted': '#94A3B8', 
      },
      backgroundImage: {
        // Useful for the gradient text seen on "PROJECTS"
        'blue-gradient': 'linear-gradient(to right, #0088FF, #33A9FF)',
      },
      fontFamily: {
        // The new design primarily uses a clean sans-serif
        sans: ['var(--font-inter)', 'sans-serif'], 
        mono: ['var(--font-fira-code)', 'monospace'],
      },
      boxShadow: {
        // Custom drop shadow to replicate the glowing effect on the central cube or buttons
        'neon-blue': '0 0 15px rgba(0, 136, 255, 0.4), 0 0 30px rgba(0, 136, 255, 0.2)',
      },
    },
  },
  plugins: [],
}
