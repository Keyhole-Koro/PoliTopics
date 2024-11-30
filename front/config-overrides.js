const path = require('path');

module.exports = (config, env) => {
  console.log('Override Config:', config);  // デバッグログ追加

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.alias,
      '@interfaces': path.resolve(__dirname, './src/interfaces/'),
      '@utils': path.resolve(__dirname, './src/utils/')
    },
    extensions: ['.js', '.ts', '.d.ts', '.tsx']
  };

  return config;
};
