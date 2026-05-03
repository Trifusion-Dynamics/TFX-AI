import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          base: '#003f5c',
          purple: '#58508d',
          violet: '#8a508f',
          pink: '#bc5090',
          rose: '#de5a79',
          red: '#ff6361',
          orange: '#ff8531',
          yellow: '#ffa600'
        },
        dark: {
          bg: '#0a0a0f',
          card: '#0f0f1a',
          border: '#1a1a2e',
          muted: '#16213e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #bc5090, #ff6361, #ff8531)',
        'gradient-cool': 'linear-gradient(135deg, #003f5c, #58508d, #8a508f)',
        'gradient-warm': 'linear-gradient(135deg, #ff6361, #ff8531, #ffa600)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
