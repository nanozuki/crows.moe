const path = require('path');

module.exports = {
  modify: (config) => {
    config.resolve.modules.unshift(path.resolve(__dirname, './src'));
    return config;
  },
};
