const common = require('./webpack.common.config');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
            new CleanWebpackPlugin(['dist']),
        ],
        externals: createExternals([
            'react',
            'react-dom',
        ])
    };

    return config;
};