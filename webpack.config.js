const path = require('path');
const webpack = require('webpack');

module.exports = function () {
    var config = {};

    config.entry = {
        main: './src/index.js'
    };

    config.output = {
        path: __dirname + '/dist',
        filename: 'react-plotting.js',
        //publicPath: '/',
        libraryTarget: 'commonjs2'
    };

    let babelLoader = {
        loader: 'babel-loader', options: {
            presets: ['es2015-ie', 'react'],
            plugins: ["transform-object-rest-spread"]
        }
    };

    config.module = {
        rules: [
            {
                test: /\.jsx?$/,
                use: [babelLoader],
                exclude: /node_modules/,

            }
        ]
    };

    config.plugins = [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        })
    ];

    config.externals = {
        'react': 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
    };

    return config;
}();