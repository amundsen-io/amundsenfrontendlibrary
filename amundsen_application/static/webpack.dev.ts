import * as path from 'path';
import merge from 'webpack-merge';
import commonConfig, {htmlWebpackPluginConfig} from './webpack.common';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default merge(commonConfig, {
  devServer: {
      contentBase: path.join(__dirname, '../build/lib/amundsen_application/static/dist'),
      publicPath: '/static/dist/',
      watchContentBase: true,
      port: 60480,
      proxy: {
          '!(/static/dist/**.*)': {
              target: 'http://127.0.0.1:60477',
              secure: false,
          },
      },
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
  },
  plugins: [
      new MiniCssExtractPlugin(),
      ...htmlWebpackPluginConfig("http://localhost:60480"), // should match port number above for devserver
  ]
});
