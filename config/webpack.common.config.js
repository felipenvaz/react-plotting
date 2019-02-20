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
                            'ts-loader',
                            'tslint-loader'
                        ],
                        exclude: /node_modules/
                    }
                ],
            },
            resolve: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                mainFiles: ['index']
            },
            plugins: [

            ]
        };

        return config;
    }
};