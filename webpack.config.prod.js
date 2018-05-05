const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const bundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = Object.assign(webpackConfig, {
    entry: {
        ReactPlotting: './src'
    },
    output: Object.assign(webpackConfig.output, {
        library: ['ReactPlotting'],
        libraryTarget: 'umd'
    }),
    plugins: [
        new WebpackCleanupPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        //new bundleAnalyzer()
    ],
    externals: {
        react: {
          root: 'React',
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'react'
        },
        'react-dom': {
          root: 'ReactDOM',
          commonjs: 'react-dom',
          commonjs2: 'react-dom',
          amd: 'react-dom'
        }
      }
});