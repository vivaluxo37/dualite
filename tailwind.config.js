/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
    darkMode: ['class'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['"DM Sans"', ...fontFamily.sans],
          inter: ['"Inter"', ...fontFamily.sans],
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
        },
        keyframes: {
          'accordion-down': {
            from: {
              height: '0',
            },
            to: {
              height: 'var(--radix-accordion-content-height)',
            },
          },
          'accordion-up': {
            from: {
              height: 'var(--radix-accordion-content-height)',
            },
            to: {
              height: '0',
            },
          },
          'marquee': {
            from: { transform: 'translateX(0)' },
            to: { transform: 'translateX(-50%)' },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'marquee': 'marquee 30s linear infinite',
        },
      },
    },
    plugins: [require('tailwindcss-animate')],
  };
