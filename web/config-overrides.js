const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = function override(config, env) {
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    },
  };
  return config;
};
