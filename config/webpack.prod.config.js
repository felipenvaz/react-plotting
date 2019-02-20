const common = require('./webpack.common.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

function createExternals(packageNames) {
    const externals = {};
    packageNames.forEach(function (pkg) {
        externals[pkg] = {
            commonjs: pkg,
            commonjs2: pkg
        };
    });
    return externals;
}

module.exports = new function () {
    const config = {
        ...common.config,
        mode: 'production',
        entry: {
            components: `${common.rootDir}/src/index.ts`
        },
        output: {
            filename: 'index.js',
            libraryTarget: 'umd',
            path: `${common.rootDir}/dist`
        },
        plugins: [
            ...common.config.plugins,
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map',
                exclude: [/node_modules/],
                test: /\.(js|css|tsx?)$/
            }),
            new CleanWebpackPlugin([`dist`], {
                root: common.rootDir
            }),
        ],
        externals: createExternals([
            'react',
            'react-dom',
        ])
    };

    return config;
};