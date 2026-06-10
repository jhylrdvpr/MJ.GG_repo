export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'lol-bg': '#07040f',
        'lol-surface': '#120717',
        'lol-surface-soft': '#1c1027',
        'lol-gold': '#f1c85d',
        'lol-gold-soft': '#c99b3f',
        'lol-purple': '#7d44c6',
        'lol-muted': '#b7a47f',
        'lol-border': 'rgba(241, 200, 93, 0.18)',
      },
      boxShadow: {
        glow: '0 0 40px rgba(241, 200, 93, 0.18)',
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'lol-hero': 'radial-gradient(circle at top, rgba(241, 200, 93, 0.12), transparent 30%), radial-gradient(circle at bottom right, rgba(125, 68, 198, 0.16), transparent 35%)',
      },
    },
  },
  plugins: [],
};
