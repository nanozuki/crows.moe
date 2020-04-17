const palette = {
  dark0_hard: '#1d2021',
  dark0: '#282828',
  dark0_soft: '#32302f',
  dark1: '#3c3836',
  dark2: '#504945',
  dark3: '#665c54',
  dark4: '#7c6f64',
  dark4_256: '#7c6f64',

  gray_245: '#928374',
  gray_244: '#928374',

  light0_hard: '#f9f5d7',
  light0: '#fbf1c7',
  light0_soft: '#f2e5bc',
  light1: '#ebdbb2',
  light2: '#d5c4a1',
  light3: '#bdae93',
  light4: '#a89984',
  light4_256: '#a89984',

  bright_red: '#fb4934',
  bright_green: '#b8bb26',
  bright_yellow: '#fabd2f',
  bright_blue: '#83a598',
  bright_purple: '#d3869b',
  bright_aqua: '#8ec07c',
  bright_orange: '#fe8019',

  neutral_red: '#cc241d',
  neutral_green: '#98971a',
  neutral_yellow: '#d79921',
  neutral_blue: '#458588',
  neutral_purple: '#b16286',
  neutral_aqua: '#689d6a',
  neutral_orange: '#d65d0e',

  faded_red: '#9d0006',
  faded_green: '#79740e',
  faded_yellow: '#b57614',
  faded_blue: '#076678',
  faded_purple: '#8f3f71',
  faded_aqua: '#427b58',
  faded_orange: '#af3a03',
};

const Token = {
  bg: 'bg',
  bg0: 'bg0',
  bg0Hard: 'bg0Hard',
  bg0Soft: 'bg0Soft',
  bg1: 'bg1',
  bg2: 'bg2',
  bg3: 'bg3',
  bg4: 'bg4',

  fg: 'fg',
  fg0: 'fg0',
  fg1: 'fg1',
  fg2: 'fg2',
  fg3: 'fg3',
  fg4: 'fg4',

  gray: 'gray',
  grayHard: 'grayHard',
  graySoft: 'graySoft',

  red: 'red',
  redHard: 'redHard',
  green: 'green',
  greenHard: 'greenHard',
  yellow: 'yellow',
  yellowHard: 'yellowHard',
  blue: 'blue',
  blueHard: 'blueHard',
  purple: 'purple',
  purpleHard: 'purpleHard',
  aqua: 'aqua',
  aquaHard: 'aquaHard',
  orange: 'orange',
  orangeHard: 'orangeHard',
};

const lightMode = {
  bg: palette.light0,
  bg0: palette.light0,
  bg0Soft: palette.light0_soft,
  bg0Hard: palette.light0_hard,
  bg1: palette.light1,
  bg2: palette.light2,
  bg3: palette.light3,
  bg4: palette.light4,

  fg: palette.dark1,
  fg0: palette.dark0,
  fg1: palette.dark1,
  fg2: palette.dark2,
  fg3: palette.dark3,
  fg4: palette.dark4,

  gray: palette.gray_244,
  grayHard: palette.dark4_256,

  red: palette.neutral_red,
  redHard: palette.faded_red,
  green: palette.neutral_green,
  greenHard: palette.faded_green,
  yellow: palette.neutral_yellow,
  yellowHard: palette.faded_yellow,
  blue: palette.neutral_blue,
  blueHard: palette.faded_blue,
  purple: palette.neutral_purple,
  purpleHard: palette.faded_purple,
  aqua: palette.neutral_aqua,
  aquaHard: palette.faded_aqua,
  orange: palette.neutral_orange,
  orangeHard: palette.faded_orange,
};

const darkMode = {
  bg: palette.dark0,
  bg0: palette.dark0,
  bg0Soft: palette.dark0_soft,
  bg0Hard: palette.dark0_hard,
  bg1: palette.dark1,
  bg2: palette.dark2,
  bg3: palette.dark3,
  bg4: palette.dark4,

  fg: palette.light1,
  fg0: palette.light0,
  fg1: palette.light1,
  fg2: palette.light2,
  fg3: palette.light3,
  fg4: palette.light4,

  gray: palette.gray_244,
  grayHard: palette.light4_256,

  red: palette.neutral_red,
  redHard: palette.bright_red,
  green: palette.neutral_green,
  greenHard: palette.bright_green,
  yellow: palette.neutral_yellow,
  yellowHard: palette.bright_yellow,
  blue: palette.neutral_blue,
  blueHard: palette.bright_blue,
  purple: palette.neutral_purple,
  purpleHard: palette.bright_purple,
  aqua: palette.neutral_aqua,
  aquaHard: palette.bright_aqua,
  orange: palette.neutral_orange,
  orangeHard: palette.bright_orange,
};

const useColor = (token) => (props) => props.theme[token];
const colorTrans = (attrs) => {
  const trans = attrs.map((attr) => `${attr} 0.5s ease-in-out`);
  return `transition: ${trans.join(', ')};`;
};

export {
  useColor, colorTrans, Token, lightMode, darkMode,
};
