module.exports = api => {
  api.cache(true);

  const presets = [
    ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 'corejs@3', }],
    '@babel/preset-react',
    'linaria/babel',
  ];
  const plugins = [
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    'react-hot-loader/babel',
    '@babel/plugin-syntax-dynamic-import',
  ];

  return {
    presets,
    plugins,
  };
};
