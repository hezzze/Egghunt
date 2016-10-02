var path = require('path');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
  debug: true, //TODO: figure out what this means
  output: {
    path: './build',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    historyApiFallback: true,
    stats: 'minimal'
  }
});
