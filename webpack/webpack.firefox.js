const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.join(__dirname, '../dist-firefox/app'),
        filename: '[name].js',
    },
    optimization: {
        minimize: false,
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    plugins: [
        // copy manifest
        new CopyPlugin([{ from: './manifest-firefox.json', to: '../manifest.json' }], {
            context: 'src/manifest',
        }),
    ],
});
