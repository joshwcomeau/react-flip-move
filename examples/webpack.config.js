var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  devtool: 'source-map',

  entry: {
    '1_shuffle': './1_shuffle/index.jsx'
  },

  output: {
    path: __dirname,
    filename: '[name]/bundle.js',
    sourceMapFilename: '[name]/bundle.map'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name]/style.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV:       JSON.stringify('production'),
        UNIVERSAL_ENV:  JSON.stringify('client')
      }
    })
  ],

  module: {
    loaders: [
      // JAVASCRIPT
      {
        test:     /\.jsx?$/,
        loader:   'babel',
        exclude:  /node_modules/
      },
      // SASS
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css!sass')
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx', '.sass'],
    modulesDirectories: ['src', 'node_modules']
  }
}
