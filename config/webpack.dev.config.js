const common = require('./webpack.common.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = new function () {
    const config = {
        ...common.config,
        entry: {
            components: `${common.rootDir}/example/index.tsx`
        },
        mode: 'development',
        devServer: {
            stats: 'minimal',
            inline: true,
            publicPath: '/',
            port: 9001
        },
        plugins: [
            ...common.config.plugins,
            new HtmlWebpackPlugin({
                template: `${common.rootDir}/example/index.html`,
                inject: 'body'
            })
        ],
    };

    return config;
};