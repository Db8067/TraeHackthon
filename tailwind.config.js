/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'medical-red': '#dc2626', // Red-600
        'medical-blue': '#1e3a8a', // Blue-900
        'alert-red': '#ef4444',
        'safe-green': '#10b981',
        'slate-dark': '#0f172a',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
