/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#5B6CF0',
          dark: '#3A48B8',
          primary: '#5B6CF0',
          secondary: '#3A48B8',
          accent: '#E5E9FE',
        },
        surface: {
          base: '#FFFFFF',
          muted: '#F8F9FC',
          border: '#E8EBF5',
        },
        text: {
          main: '#1A1A1A',
          muted: '#666666',
        },
        'text-main': '#1A1A1A',
        'text-muted': '#666666',
        success: {
          subtle: '#ECFDF3',
          base: '#027A48',
        },
        warning: {
          subtle: '#FFFAEB',
          base: '#B54708',
        },
      },
      fontSize: {
        'heading-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'heading-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'heading-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1.25rem',
        xl2: '1.5rem',
        full: '9999px',
      },
      boxShadow: {
        soft: '0 10px 40px -10px rgba(0,0,0,0.08)',
        card: '0 10px 30px -12px rgba(91, 108, 240, 0.35)',
      },
    },
  },
  plugins: [],
};
