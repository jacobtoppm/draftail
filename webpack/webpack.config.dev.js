/* eslint-disable import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

require('dotenv').config();

const extractSass = new ExtractTextPlugin('draftail.css');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    // See http://webpack.github.io/docs/configuration.html#devtool
    devtool: 'inline-source-map',
    entry: {
        vendor: ['react', 'react-dom', 'immutable', 'draft-js', 'draftjs-utils'],
        intro: './examples/intro',
        basic: './examples/basic',
        entities: './examples/entities',
        custom: './examples/custom',
        test: './examples/test',
    },
    output: {
        path: path.join(__dirname, '..', 'build'),
        filename: '[name].bundle.js',
        publicPath: '/assets/',
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
        extractSass,
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            // Set an environment variable of EMBEDLY_API_KEY to use this in development.
            EMBEDLY_API_KEY: JSON.stringify(process.env.EMBEDLY_API_KEY),
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [
                        { loader: 'css-loader', options: { sourceMap: !isProduction } },
                        { loader: 'sass-loader', options: { sourceMap: !isProduction } },
                    ],
                }),
            },
        ],
    },

    stats: {
        // Add chunk information (setting this to `false` allows for a less verbose output)
        chunks: false,
        // Add the hash of the compilation
        hash: false,
        // `webpack --colors` equivalent
        colors: true,
        // Add information about the reasons why modules are included
        reasons: false,
        // Add webpack version information
        version: false,
    },

    // Some libraries import Node modules but don't use them in the browser.
    // Tell Webpack to provide empty mocks for them so importing them works.
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },

    devServer: {
        contentBase: path.join(__dirname, '..', 'examples'),
        compress: true,
        hot: true,
        port: 4000,
        overlay: true,
        clientLogLevel: 'none',
    },
};