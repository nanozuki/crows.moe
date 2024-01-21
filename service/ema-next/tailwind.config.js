/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,html,svelte}'],
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
        nomination: '1fr 10rem',
        ballot: '2rem minmax(2rem, 1fr)',
      },
      borderWidth: {
        1: '1px',
      },
    },
    fontFamily: {
      sans: ['Noto Sans SC', 'sans-serif'],
      serif: ['Noto Serif SC', 'serif'],
    },
    screens: {
      mid: '448px', // 400 + 24*2
      wide: '688px', // 640 + 24*2
    },
  },
  plugins: [],
};
