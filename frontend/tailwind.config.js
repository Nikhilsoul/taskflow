export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#151321',
        signal: {
          50: '#f2f0ff',
          100: '#e6e2ff',
          400: '#8b7cf6',
          500: '#6c4eeb',
          600: '#5734d6',
          700: '#4527ab',
        },
        ember: '#f2704f',
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
};
