import tailwindcssAnimate from 'tailwindcss-animate'

/**
 * Дизайн-токены проекта.
 * Все цвета — HSL-триплеты в CSS-переменных, чтобы тема переключалась без пересборки CSS.
 * Источник правды по значениям — src/index.css (блок :root / .dark).
 */
const colors = {
  background: 'hsl(var(--background) / <alpha-value>)',
  foreground: 'hsl(var(--foreground) / <alpha-value>)',
  card: 'hsl(var(--card) / <alpha-value>)',
  'card-foreground': 'hsl(var(--card-foreground) / <alpha-value>)',
  popover: 'hsl(var(--popover) / <alpha-value>)',
  'popover-foreground': 'hsl(var(--popover-foreground) / <alpha-value>)',
  primary: 'hsl(var(--primary) / <alpha-value>)',
  'primary-foreground': 'hsl(var(--primary-foreground) / <alpha-value>)',
  secondary: 'hsl(var(--secondary) / <alpha-value>)',
  'secondary-foreground': 'hsl(var(--secondary-foreground) / <alpha-value>)',
  muted: 'hsl(var(--muted) / <alpha-value>)',
  'muted-foreground': 'hsl(var(--muted-foreground) / <alpha-value>)',
  accent: 'hsl(var(--accent) / <alpha-value>)',
  'accent-foreground': 'hsl(var(--accent-foreground) / <alpha-value>)',
  destructive: 'hsl(var(--destructive) / <alpha-value>)',
  'destructive-foreground': 'hsl(var(--destructive-foreground) / <alpha-value>)',
  success: 'hsl(var(--success) / <alpha-value>)',
  'success-foreground': 'hsl(var(--success-foreground) / <alpha-value>)',
  warning: 'hsl(var(--warning) / <alpha-value>)',
  'warning-foreground': 'hsl(var(--warning-foreground) / <alpha-value>)',
  info: 'hsl(var(--info) / <alpha-value>)',
  'info-foreground': 'hsl(var(--info-foreground) / <alpha-value>)',
  border: 'hsl(var(--border) / <alpha-value>)',
  input: 'hsl(var(--input) / <alpha-value>)',
  ring: 'hsl(var(--ring) / <alpha-value>)',
  'diagram-surface': 'hsl(var(--diagram-surface) / <alpha-value>)',
  'diagram-node': 'hsl(var(--diagram-node) / <alpha-value>)',
  'diagram-node-strong': 'hsl(var(--diagram-node-strong) / <alpha-value>)',
  'diagram-stroke': 'hsl(var(--diagram-stroke) / <alpha-value>)',
  'diagram-text': 'hsl(var(--diagram-text) / <alpha-value>)',
  'diagram-muted': 'hsl(var(--diagram-muted) / <alpha-value>)',
  'diagram-flow': 'hsl(var(--diagram-flow) / <alpha-value>)',
  'diagram-weak': 'hsl(var(--diagram-weak) / <alpha-value>)',
  'diagram-accent': 'hsl(var(--diagram-accent) / <alpha-value>)',
  'diagram-accent-soft': 'hsl(var(--diagram-accent-soft) / <alpha-value>)',
}

const radius = {
  xs: 'var(--radius-xs)',
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  xl: 'var(--radius-xl)',
  '2xl': 'var(--radius-2xl)',
  full: 'calc(infinity * 1px)',
}

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors,
      borderRadius: radius,
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          '"SF Mono"',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          'monospace',
        ],
      },
      fontSize: {
        display: ['clamp(2rem, 1.4rem + 2.6vw, 3rem)', { lineHeight: '1.12', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(1.625rem, 1.3rem + 1.6vw, 2.125rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        h2: ['clamp(1.375rem, 1.2rem + 0.9vw, 1.75rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        h3: ['1.25rem', { lineHeight: '1.35' }],
        h4: ['1.0625rem', { lineHeight: '1.4' }],
        body: ['1rem', { lineHeight: '1.65' }],
        small: ['0.875rem', { lineHeight: '1.55' }],
        tiny: ['0.78rem', { lineHeight: '1.45' }],
      },
      spacing: {
        section: 'clamp(2.5rem, 2rem + 3vw, 4.5rem)',
        gutter: 'clamp(1rem, 0.7rem + 1.6vw, 2rem)',
      },
      maxWidth: {
        prose: '68ch',
        content: '76rem',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
        'card-hover': 'var(--shadow-card-hover)',
        brand: 'var(--brand-glow)',
      },
      backgroundImage: {
        brand: 'var(--brand-gradient)',
        'brand-soft': 'var(--brand-gradient-soft)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'none' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(4%, -3%, 0) scale(1.08)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 240ms cubic-bezier(0.22, 1, 0.36, 1) both',
        aurora: 'aurora 22s ease-in-out infinite',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
