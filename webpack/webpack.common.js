const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('app.css');

module.exports = {
    entry: {
        theme: path.join(__dirname, '../src/theme/app.scss'),
        popup: path.join(__dirname, '../src/popup.ts'),
        options: path.join(__dirname, '../src/options.ts'),
        background: path.join(__dirname, '../src/background.ts'),
        content_script: path.join(__dirname, '../src/content_script.ts'),
    },
    output: {
        path: path.join(__dirname, '../dist/app'),
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            name: 'vendor',
            chunks: 'initial',
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: extractCSS.extract(['css-loader']),
            },
            {
                test: /\.scss$/,
                use: extractCSS.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader'],
                }),
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        modules: ['node_modules'],
    },
    plugins: [
        extractCSS,
        // exclude locale files in moment
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        // copy html pages
        new CopyPlugin([{ from: '.', to: '../app' }], {
            context: 'src/pages',
        }),
        // copy icons
        new CopyPlugin([{ from: '.', to: '../icons' }], {
            context: 'src/icons',
        }),
        // copy bulma css
        new CopyPlugin(
            [
                { from: './bulma/css/bulma.min.css', to: './bulma.min.css' },
                { from: './bulma/css/bulma.css.map', to: './bulma.css.map' },
            ],
            {
                context: 'node_modules',
            }
        ),
    ],
};
