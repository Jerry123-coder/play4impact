/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0D1117',
        'brand-card': '#161B22',
        'brand-primary': '#1212cf',
        'brand-secondary': '#1f8af1',
        'brand-accent': '#FAF10F',
        'brand-text-primary': '#C9D1D9',
        'brand-text-secondary': '#8B949E',
        'brand-dark-blue': '#000056',
        'p4i-navy': '#10324B',
        'p4i-teal': '#005461',
        'p4i-lime': '#83D318',
        'p4i-cream': '#F1F9E5'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        headings: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px 0 rgba(88, 166, 255, 0.3)',
        'glow-md': '0 0 25px 0 rgba(88, 166, 255, 0.4)',
        'glow-lime': '0 0 25px 0 rgba(131, 211, 24, 0.4)',
      }
    },
  },
  plugins: [],
}
