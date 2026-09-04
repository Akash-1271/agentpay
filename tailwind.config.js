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
        ground: {
          deep: '#080B11',
          secondary: '#0E131F',
        },
        ink: {
          primary: '#F1F5F9',
          bone: '#EDE7DC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
        accent: {
          blue: '#0C83FF',
          cyan: '#38BDF8',
          amber: '#E8913C',
        },
        // Backwards compatibility mappings for existing templates
        alabaster: '#080B11',
        charcoal: '#F1F5F9',
        taupe: '#131929',
        warmgrey: '#94A3B8',
        gold: {
          DEFAULT: '#a78b71',
          base: '#a78b71',
          light: '#c9b8a0',
          hover: '#e8d5b7',
          dark: '#876b54',
          glow: 'rgba(167, 139, 113, 0.25)',
        },
        bronze: {
          DEFAULT: '#a78b71',
          light: '#c9b8a0',
          dark: '#6e5843',
        },
        obsidian: '#121212',
        champagne: '#1A1815',
        pewter: '#64748B',
        midnight: '#0a0a0a',
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
        playfair: ['"Playfair Display"', 'serif'],
        display: ['"Playfair Display"', 'serif'],
        headline: ['"Playfair Display"', '"Inter"', 'serif'],
        serif: ['"Playfair Display"', 'serif'],
        deco: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', '-apple-system', 'sans-serif'],
        body: ['"Inter"', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'hero-img': '0 8px 32px rgba(0, 0, 0, 0.6)',
        'feature-img': '0 4px 24px rgba(0, 0, 0, 0.4)',
        'card-soft': '0 2px 8px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 8px 32px rgba(167, 139, 113, 0.18)',
        'btn-primary': '0 4px 16px rgba(167, 139, 113, 0.35)',
        'btn-hover': '0 8px 24px rgba(167, 139, 113, 0.5)',
        'inner-border': 'inset 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'inner-border-dark': 'inset 0 0 0 1px rgba(167, 139, 113, 0.3)',
        'glow-gold': '0 0 80px rgba(167, 139, 113, 0.15)',
        'glow-gold-sm': '0 0 20px rgba(167, 139, 113, 0.25)',
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

