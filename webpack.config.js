const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function () {
    var config = {};

    config.entry = {
        main: './example/index.tsx'
    };

    config.output = {
        path: __dirname + '/dist',
        filename: '[name].js',
        publicPath: '/'
    };

    config.module = {
        rules: [
            {
                test: /\.tsx?$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: /node_modules/
            },
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/
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

    config.resolve = {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        mainFiles: ['index']
    };

    return config;
}();