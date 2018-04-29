const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
    var config = {};

    config.entry = {
        main: './example/index.js'
    };

    config.output = {
        path: __dirname + '/dist',
        filename: 'index.js',
        publicPath: '/'
    };

    config.module = {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader',
                exclude: /node_modules/,

            }
        ]
    };

    config.plugins = [
        new HtmlWebpackPlugin({
            template: './example/index.html',
            inject: 'body'
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ];

    config.devServer = {
        stats: 'minimal',
        inline: true,
        publicPath: '/',
        port: 8083
    };

    return config;
}();