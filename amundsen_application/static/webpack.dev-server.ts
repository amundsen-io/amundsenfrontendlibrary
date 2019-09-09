import merge from 'webpack-merge';
import commonConfig from './webpack.common';
const CopyPlugin = require('copy-webpack-plugin');
import HtmlWebpackPlugin from 'html-webpack-plugin';

import appConfig from './js/config/config';

let conf =  merge(commonConfig, {
    devtool: 'cheap-eval-source-map',
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devServer: {
        hot: true,
        index: 'index.html',
        //Tell webpack-dev-server if it sees any requests for /api/**, to forward them on to localhost:5000 (i.e. wsgi server)
        //5000 is static - if you run your amundsen_application/wsgi.py on a different port, you will need to replace 5000 with that port
        proxy: {
            "/api/**": {
                target: 'http://localhost:5000',
                secure: false,
            },
        },
    },
    plugins: [
        //when starting webpack-dev-server, serve all requests for static/{images,fonts} from {images,fonts}
        new CopyPlugin([
            {
                from: 'images',
                to: 'static/images',
            },
            {
                from: 'fonts',
                to: 'static/fonts',
            },
        ]),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'templates/index.html',
            inject: false,
            config: appConfig, //use the same appConfig as webpack common, so the template can detect if we have Google analytics enabled.
            assetOutputDir: '', //when rendering the template in webpack-dev-server, don't prepend any path on to the assets.
        }),
    ],

});

export default conf;
