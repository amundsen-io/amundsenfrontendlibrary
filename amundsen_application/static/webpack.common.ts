import * as path from 'path';
import * as fs from 'fs';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import {BundleAnalyzerPlugin} from 'webpack-bundle-analyzer';
import MomentLocalesPlugin from 'moment-locales-webpack-plugin';
import {CleanWebpackPlugin} from 'clean-webpack-plugin';

import appConfig from './js/config/config';

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    filelist = fs.statSync(path.join(dir, file)).isDirectory()
      ? walkSync(path.join(dir, file), filelist)
      : filelist.concat(path.join(dir, file));
  });
  return filelist;
};
// const templatesList = walkSync('templates');
// const htmlWebpackPluginConfig = templatesList.map(file => {
//   return new HtmlWebpackPlugin({
//       filename: file,
//       template: file,
//       config: appConfig,
//       inject: false,
//     });
// });
const htmlWebpackPluginConfig = [
  new HtmlWebpackPlugin({
    filename: 'templates/index.html',
    template: 'templates/index.html',
    config: appConfig,
    inject: false,
  }),
  new HtmlWebpackPlugin({
    filename: 'templates/fragments/google-analytics-loader.html',
    template: 'templates/fragments/google-analytics-loader.html',
    config: appConfig,
    inject: false,
  }),
  new HtmlWebpackPlugin({
    filename: 'templates/fragments/google-analytics-post-loader.html',
    template: 'templates/fragments/google-analytics-post-loader.html',
    config: appConfig,
    inject: false,
  })
];

const TSX_PATTERN = /\.ts|\.tsx$/;
const JSX_PATTERN = /\.jsx?$/;
// const JSX_PATTERN = /\.(js|jsx)$/;
const CSS_PATTERN = /\.(sa|sc|c)ss$/;
const IMAGE_PATTERN = /\.(png|svg|jpg|gif)$/;

const config: webpack.Configuration = {
    entry: {
      main: [
        path.join(__dirname, '/css/styles.scss'),
        path.join(__dirname, '/js/index.tsx')
      ],
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].[contenthash].js',
    },
    devtool: 'source-map',
    resolve: {
        alias: {
            components: path.join(__dirname, '/js/components'),
            config: path.join(__dirname, '/js/config'),
            ducks: path.join(__dirname, '/js/ducks'),
            interfaces: path.join(__dirname, '/js/interfaces'),
            utils: path.join(__dirname, '/js/utils'),
        },
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss'],
    },
    module: {
      rules: [
        {
          test: TSX_PATTERN,
          loader: 'ts-loader',
        },
        {
          test: JSX_PATTERN,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: CSS_PATTERN,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.join(__dirname, '/css/')]
              }
            }
          ],
        },
        {
          test: IMAGE_PATTERN,
          use: 'file-loader',
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MomentLocalesPlugin(),    // To strip all locales except “en”
      new MiniCssExtractPlugin(),
      ...htmlWebpackPluginConfig,
      // new BundleAnalyzerPlugin()   // Uncomment to analyze the production bundle on local
    ],
    optimization: {
      moduleIds: 'hashed',
      splitChunks: {
        cacheGroups: {
          default: false,
          major: {
            name: 'vendors',
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            chunks: 'all',
          },
        },
      },
    },
};
export default config;


// {
//   filename: '[name].[contenthash].css',
// }
