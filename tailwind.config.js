/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#080B11',
        surface: '#0E131F',
        'surface-elevated': '#131929',
        'surface-border': 'rgba(255, 255, 255, 0.08)',
        // Backwards compatibility mappings for existing templates
        alabaster: '#080B11',
        charcoal: '#F1F5F9',
        taupe: '#131929',
        warmgrey: '#94A3B8',
        gold: {
          DEFAULT: '#0C83FF',
          light: '#38BDF8',
          dark: '#0066CC',
          glow: 'rgba(12, 131, 255, 0.25)',
        },
        obsidian: '#0E131F',
        champagne: '#1A2238',
        pewter: '#64748B',
        midnight: '#080B11',
        razorpay: {
          DEFAULT: '#0C83FF',
          light: '#38BDF8',
          dark: '#0066CC',
          glow: 'rgba(12, 131, 255, 0.25)',
        },
        emerald: {
          DEFAULT: '#10B981',
          light: '#34D399',
          dark: '#059669',
          glow: 'rgba(16, 185, 129, 0.25)',
        },
      },
      fontFamily: {
        serif: ['"Inter"', '-apple-system', 'sans-serif'],
        headline: ['"Inter"', '-apple-system', 'sans-serif'],
        deco: ['"Inter"', '-apple-system', 'sans-serif'],
        sans: ['"Inter"', '-apple-system', 'sans-serif'],
        body: ['"Inter"', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'hero-img': '0 8px 32px rgba(0, 0, 0, 0.4)',
        'feature-img': '0 4px 24px rgba(0, 0, 0, 0.3)',
        'card-soft': '0 2px 8px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 24px rgba(12, 131, 255, 0.12)',
        'btn-primary': '0 4px 16px rgba(12, 131, 255, 0.3)',
        'btn-hover': '0 8px 24px rgba(12, 131, 255, 0.45)',
        'inner-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'inner-border-dark': 'inset 0 0 0 1px rgba(12, 131, 255, 0.3)',
        'glow-blue': '0 0 20px rgba(12, 131, 255, 0.25)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.25)',
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      transitionDuration: {
        '500': '500ms',
        '700': '700ms',
        '1500': '1500ms',
        '2000': '2000ms',
      },
    },
  },
  plugins: [],
}

