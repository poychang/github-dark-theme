const merge = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    output: {
        path: path.join(__dirname, '../dist/app'),
        filename: '[name].js',
    },
});
