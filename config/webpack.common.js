var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = {
  entry: {
    app: ['./src/main.jsx'],
    vendors: ['react', 'poly2tri', './src/vendors.js']
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    modulesDirectories: ['node_modules', 'assets']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel',
      query: {
        presets: ['react', 'es2015'],
        plugins: ['babel-plugin-transform-decorators-legacy',
        'babel-plugin-transform-class-properties',
        'babel-plugin-transform-object-rest-spread'
      ]},
      exclude: /node_modules/
    },{
      test: /\.css$/,
      loader: 'css'
    },{
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'file?name=assets/[name].[hash].[ext]'
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass')
    }, {
      test: /\.json$/,
      loader: 'json'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
      poly2tri: 'poly2tri'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendors']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
