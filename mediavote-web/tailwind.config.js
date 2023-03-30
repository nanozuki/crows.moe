/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      base: '#faf4ed',
      surface: '#fffaf3',
      overlay: '#f2e9e1',
      muted: '#9893a5',
      subtle: '#797593',
      text: '#575279',
      love: '#b4637a',
      gold: '#ea9d34',
      rose: '#d7827e',
      pine: '#286983',
      foam: '#56949f',
      iris: '#907aa9',
      highlight: {
        low: '#f4ede8',
        med: '#dfdad9',
        high: '#cecacd',
      },
    },
    extend: {
      spacing: {
        em: '1em',
      },
      gridTemplateColumns: {
        vote: '4rem minmax(4rem, 1fr)',
        result: '1rem minmax(1rem, 1fr)',
      },
      borderWidth: {
        1: '1px',
      },
    },
    fontFamily: {
      sans: ['source-han-sans-cjk-sc', 'sans-serif'],
      serif: ['source-han-serif-sc', 'serif'],
    },
    screens: {
      mid: '480px',
      wide: '672px', // 640 + 16*2
    },
  },
  plugins: [],
};
