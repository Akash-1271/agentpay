/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alabaster: '#F9F8F6',
        charcoal: '#1A1A1A',
        taupe: '#EBE5DE',
        warmgrey: '#6C6863',
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5E8B7',
          dark: '#AA820A',
          glow: 'rgba(212, 175, 55, 0.25)',
        },
        obsidian: '#1A1A1A',
        champagne: '#EBE5DE',
        pewter: '#6C6863',
        midnight: '#141414',
        razorpay: {
          DEFAULT: '#0c83ff',
          dark: '#0066cc',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        headline: ['"Playfair Display"', 'Georgia', 'serif'],
        deco: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '-apple-system', 'sans-serif'],
        body: ['"Inter"', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        '3xl': '0px',
        full: '0px',
      },
      letterSpacing: {
        tightest: '-0.05em',
        button: '0.2em',
        label: '0.25em',
        deco: '0.25em',
        widest: '0.25em',
        'ultra-wide': '0.3em',
      },
      boxShadow: {
        'hero-img': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'feature-img': '0 4px 24px rgba(0, 0, 0, 0.08)',
        'card-soft': '0 2px 8px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.06)',
        'btn-primary': '0 4px 16px rgba(0, 0, 0, 0.15)',
        'btn-hover': '0 8px 24px rgba(0, 0, 0, 0.25)',
        'inner-border': 'inset 0 0 0 1px rgba(0, 0, 0, 0.06)',
        'inner-border-dark': 'inset 0 0 0 1px rgba(212, 175, 55, 0.2)',
        'gold-glow': '0 0 15px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 25px rgba(212, 175, 55, 0.45)',
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

