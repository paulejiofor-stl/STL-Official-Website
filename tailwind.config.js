/** Standpoint Technology design tokens — colours come from the official brand kit. */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', sm: '1.5rem', lg: '2rem' }, screens: { '2xl': '1240px' } },
    extend: {
      colors: {
        midnight: '#00163B',   // dark sections, footer
        navy: '#002355',       // primary: headings, buttons, links
        slate: { DEFAULT: '#183D56', 600: '#3A5568', 400: '#6B8193' }, // body text
        signal: '#F5DF6F',     // highlight on dark
        pink: '#C84092',       // micro-accent only (dots, dividers, badges, hovers)
        mist: '#F4F6F9',       // light section background
        line: '#E3E8EF',       // hairline borders
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: { tightest: '-0.045em' },
      boxShadow: {
        card: '0 1px 2px rgba(0,22,59,.04), 0 8px 24px -12px rgba(0,22,59,.12)',
        lift: '0 2px 4px rgba(0,22,59,.06), 0 24px 48px -20px rgba(0,22,59,.28)',
      },
      maxWidth: { prose2: '42rem' },
    },
  },
  plugins: [],
};
