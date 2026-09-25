/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'neon-blue': 'hsl(var(--neon-blue) / <alpha-value>)',
        'neon-purple': 'hsl(var(--neon-purple) / <alpha-value>)',
        'neon-green': 'hsl(var(--neon-green) / <alpha-value>)',
        'tech-dark': 'hsl(var(--tech-dark) / <alpha-value>)',
        'dark-slate': 'hsl(var(--dark-slate) / <alpha-value>)',
        'light-gray': 'hsl(var(--light-gray) / <alpha-value>)',
        // Blog: light editorial palette, deliberately separate from the neon portfolio
        paper: { DEFAULT: '#F7F7FC', deep: '#EEF0FA' },
        ink: { DEFAULT: '#0F172A', soft: '#475569', faint: '#64748B' },
        rule: '#E2E8F0',
        accent: { DEFAULT: '#4338CA', soft: '#EEF2FF' },
      },
      borderColor: {
        DEFAULT: 'hsl(var(--border))',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        exo: ['Exo', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 10px 2px #00f6ff80',
        'glow-intense': '0 0 15px 5px #00f6ffb3',
        'glow-purple': '0 0 10px 2px #b026ff80',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, #00f6ff1a, #0d111700 70%)',
      },
    },
  },
  plugins: [],
}