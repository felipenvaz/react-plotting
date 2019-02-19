const webpack = require('webpack');
const path = require('path');
const rootDir = path.resolve(__dirname, '../');

module.exports = {
    rootDir: rootDir,
    config: new function () {
        const config = {
            mode: 'none',
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: [
                            'babel-loader',
                            'ts-loader'
                        ],
                        exclude: /node_modules/
                    }
                ],
            },
            optimization: {
                sideEffects: true,
                providedExports: true,
                usedExports: true
            },
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                mainFiles: ['index']
            },
            plugins: []
        };

        return config;
    }
};