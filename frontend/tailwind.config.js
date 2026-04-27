/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',
          secondary: '#4f46e5',
        },
        success: {
          subtle: '#dcfce7',
          base: '#22c55e',
        },
        warning: {
          subtle: '#fef9c3',
          base: '#eab308',
        },
        surface: {
          base: '#ffffff',
          muted: '#f3f4f6',
        }
      },
      fontSize: {
        'heading-lg': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '700' }],
        'heading-md': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '400' }],
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
      }
    },
  },
  plugins: [],
}
