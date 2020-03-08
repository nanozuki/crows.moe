const { join } = require('path');
const createResolver = require('postcss-import-resolver');
// const bemLinter = require('postcss-bem-linter');

module.exports = () => ({
  sourceMap: true,
  plugins: {
    'postcss-import': {
      plugins: [
        require('stylelint')({
          resolve: createResolver({
            alias: {
              '~': join(__dirname),
              // '~~': join(__dirname),
              // '@': join(__dirname, 'src'),
              // '@@': join(__dirname),
            },
          }),
        }),
      ],
    },
    'postcss-url': {},
    'postcss-preset-env': {
      stage: 2,
      features: {
        'nesting-rules': true,
      },
    },
    'postcss-easing-gradients': {},
    'postcss-hexrgba': {},
    'postcss-reporter': {},
  },
});
