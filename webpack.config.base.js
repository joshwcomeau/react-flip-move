var webpack = require('webpack');

module.exports = {
  output: {
    library: 'FlipMove',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test:     /\.jsx?$/,
        loader:   'babel',
        exclude:  /node_modules/,
        include:  /src/
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
