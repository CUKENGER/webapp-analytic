import animate from 'tailwindcss-animate'
import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        'bottom-btn': 'var(--bottom-btn-height)',
        'bottom-nav': 'var(--bottom-nav-height)',
        'padding-bottom-nav': 'var(--padding-bottom-nav)',
        'tabs-height': 'var(--tabs-height)',
        'tabs-content-height': 'var(--tabs-content-height)'
      },
      fontFamily: {
        // sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
        // mono: ['var(--font-roboto-mono)', ...defaultTheme.fontFamily.mono],
        manrope: ['Manrope', ...defaultTheme.fontFamily.sans]
      },
      fontSize: {
        header1: ['45px', '53.7px'],
        header2: ['17px', '22px'],
        button: ['14px', '16.71px'],
        body1: ['24px', '28.64px'],
        body2: ['14px', '16.71px'],
        body2B: ['17px', '22px'],
        bottomBar: ['10px', '12px'],
        calendarDays: ['12px', '22px'],
        calendarNumbers: ['16px', '22px']
      },
      colors: {
        'tg-background': 'var(--tg-bg-color)',
        'tg-background-invert': 'var(--tg-bg-invert-color)',
        'tg-secondary': 'var(--tg-secondary-bg-color)',
        'tg-tertiary': 'var(--tg-tertiary-bg-color)',
        'tg-quaternary': 'var(--tg-quaternary-bg-color)',
        'tg-section-bg': 'var(--tg-section-bg-color)',
        'tg-text': 'var(--tg-text-color)',
        'tg-text-invert': 'var(--tg-text-color-invert)',
        'tg-hint': 'var(--tg-hint-color)',
        'tg-link': 'var(--tg-link-color)',
        'tg-primary': 'var(--tg-button-color)',
        'tg-primary-text': 'var(--tg-button-text-color)',
        'tg-accent': 'var(--tg-accent-text-color)',
        'tg-destructive': 'var(--tg-destructive-text-color)',
        'tg-subtitle': 'var(--tg-subtitle-text-color)',
        'tg-header-bg': 'var(--tg-header-bg-color)',
        'tg-section-text': 'var(--tg-section-header-text-color)',
        'tg-overlay': 'var(--tg-overlay-floating-color)',
        'tg-separator': 'var(--tg-separator-color)',
        'gray-stroke': 'var(--gray-stroke)',
        'dark-gray-stroke': 'var(--dark-gray-stroke)',
        'selected-day': 'var(--selected-day-color)',
        'weekend-color': 'var(--weekend-color)',
        'tooltip-bg-color': 'var(--tooltip-bg-color)',
        'white-text': 'var(--white-text)',
        'gray-dark': 'var(--gray-dark)',
        'block-header': 'var(--block-header)',
        'light-gray-back': 'var(--light-gray-back)',
        'light-gray-stroke': 'var(--light-gray-stroke)',
        'blue-dark': 'var(--blue-dark)',
        gray: 'var(--gray)',
        'table-button-border': 'var(--table-button-border)',
        'table-button-hover': 'var(--table-button-hover)',
        'bg-notice': 'var(--bg-notice)',
        'bg-notice-error': 'var(--bg-notice-error)',
        'bottom-menu': 'var(--bottom-menu)',
        'bottom-menu-border': 'var(--bottom-menu-border)',
        'button-black': 'var(--button-black)',
        'bottom-button-hover': 'var(--bottom-button-hover)',
        'tooltip-chart': 'var(--tooltip-chart)',
        'tooltip-divide': 'var(--tooltip-divide)',
        'chart-button-hover': 'var(--chart-button-hover)',
        'dropdown-shadow-color': 'var(--dropdown-shadow-color)',
        'button-disabled': 'var(--button-disabled)',
        'font-blue-primary': 'var(--font-blue-primary)',
        'font-blue-secondary': 'var(--font-blue-secondary)',
        'font-pink-primary': 'var(--font-pink-primary)',
        'font-pink-secondary': 'var(--font-pink-secondary)',
        'font-purple-primary': 'var(--font-purple-primary)',
        'font-purple-secondary': 'var(--font-purple-secondary)',
        'font-orange-primary': 'var(--font-orange-primary)',
        'font-orange-secondary': 'var(--font-orange-secondary)',
        'font-dark-primary': 'var(--font-dark-primary)',
        'font-dark-secondary': 'var(--font-dark-secondary)',
        // background: 'hsl(var(--background))',
        // foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        }
      },
      keyframes: {
        progress: {
          '0%': { width: '0' },
          '20%': { width: '30%' },
          '80%': { width: '70%' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        progress: 'progress 1s ease-in-out forwards'
      },
      backgroundImage: {
        'gradient-blue': 'var(--gradient-blue)',
        'gradient-pink': 'var(--gradient-pink)',
        'gradient-purple': 'var(--gradient-purple)',
        'gradient-orange': 'var(--gradient-orange)',
        'card-gradient-blue': 'var(--card-gradient-blue)',
        'card-gradient-pink': 'var(--card-gradient-pink)',
        'card-gradient-purple': 'var(--card-gradient-purple)',
        'card-gradient-orange': 'var(--card-gradient-orange)',
        'card-gradient-green': 'var(--card-gradient-green)',
        'custom-gradient':
          'linear-gradient(to right, rgba(143, 158, 176, 0) 5%, rgba(143, 158, 176, 0.5) 40%)'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      }
    },
    screens: {
      'tabs-screen': '500px',
      'small-screen': '568px',
      'instructions-screen': '620px',
      'reports-max-screen': '1400px',
      'main-screen': '640px'
    }
  },
  plugins: [animate],
  safelist: [
    'bg-card-gradient-blue',
    'bg-card-gradient-pink',
    'bg-card-gradient-purple',
    'bg-card-gradient-orange',
    'bg-card-gradient-green'
  ]
}
