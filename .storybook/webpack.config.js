/* eslint-disable */
const path = require('path');

module.exports = {
  module: {
    loaders: [
      {
        test: /css$/,
        loaders: [ 'style', 'css' ],
        include: path.resolve(__dirname, '../')
      }
    ]
  },

  resolve: {
    alias: (process.env.REACT_IMPL === "preact") ? {
      "react": "preact-compat",
      "react-dom": "preact-compat",
      "create-react-class": "preact-compat/lib/create-react-class",
    } : {
    }
  }
}
