var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    './index.js'
  ],

  output: {
    path: __dirname,
    publicPath: '/react-flip-move/examples',
    filename: 'dist/bundle.js'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  module: {
    loaders: [
      // JAVASCRIPT
      {
        test:     /\.jsx?$/,
        loader:   'babel',
        exclude:  /node_modules/,
        include:  __dirname
      },
      // SASS
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      }
    ]
  }
}
