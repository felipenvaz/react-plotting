const common = require('./webpack.common.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = new function () {
    const config = {
        ...common.config,
        entry: {
            components: `${common.rootDir}/example/App.tsx`
        },
        mode: 'development',
        devtool: 'inline-source-map',
        devServer: {
            compress: true,
            port: 9001,
            stats: 'normal',
            historyApiFallback: true,
            inline: true,
            publicPath: '/',
        },
        plugins: [
            ...common.config.plugins,
            new HtmlWebpackPlugin({
                template: `${common.rootDir}/example/index.html`,
                inject: 'body'
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                exclude: [/node_modules/],
                test: /\.tsx?$/
            }),
        ],
    };

    return config;
};