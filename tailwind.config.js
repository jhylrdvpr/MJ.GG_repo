export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(59, 130, 246, 0.18)',
      },
      backgroundImage: {
        'hero-pattern': 'radial-gradient(circle at top, rgba(56, 189, 248, 0.2), transparent 35%), radial-gradient(circle at bottom right, rgba(168, 85, 247, 0.18), transparent 30%)',
      },
    },
  },
  plugins: [],
};
