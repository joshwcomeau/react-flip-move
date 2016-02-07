var webpack = require('webpack');

module.exports = {
  output: {
    library: 'FlipMove',
    libraryTarget: 'umd'
  },

  externals: {
    'react':      'react',
    'react-dom':  'react-dom'
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
