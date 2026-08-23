/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        razorpay: {
          DEFAULT: '#0c83ff',
          dark: '#0066cc',
          glow: 'rgba(12, 131, 255, 0.35)',
        },
      },
    },
  },
  plugins: [],
}
