//import * as path from 'path';

import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import devWebpackConfig from '../webpack.dev';

module.exports = {
  stories: ['../js/stories/**/*.stories.tsx'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
  webpackFinal: async (config) => {
    config.resolve.alias = devWebpackConfig.resolve.alias;
    config.resolve.extensions = devWebpackConfig.resolve.extensions;
    config.module = devWebpackConfig.module;
    devWebpackConfig.plugins.forEach(plugin => config.plugins.push(plugin));

    return config;
  },
};
