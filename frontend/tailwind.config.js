/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
        },
        accent: '#06B6D4',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F8FAFC',
        surface: '#FFFFFF',
        border: '#E2E8F0',
        content: {
          primary: '#0F172A',
          secondary: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        h1: ['28px', { lineHeight: '32px', fontWeight: '700' }],
        h2: ['22px', { lineHeight: '28px', fontWeight: '600' }],
        body: ['16px', { lineHeight: '24px', fontWeight: '400' }],
        label: ['14px', { lineHeight: '20px', fontWeight: '500' }],
        caption: ['12px', { lineHeight: '16px', fontWeight: '400' }],
      },
      borderRadius: {
        card: '16px',
        input: '12px',
        pill: '999px',
      },
      boxShadow: {
        card: '0 4px 12px rgba(15,23,42,0.06)',
      },
    },
  },
  plugins: [],
}
