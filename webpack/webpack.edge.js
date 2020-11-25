const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.join(__dirname, '../dist-edge/app'),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    plugins: [
        // copy manifest
        new CopyPlugin([{ from: './manifest-edge.json', to: '../manifest.json' }], {
            context: 'src/manifest',
        }),
        new webpack.DefinePlugin({
            FIREFOX: false
        }),
    ],
});
