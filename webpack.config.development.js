'use strict';

var webpack = require('webpack');
var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);

config.plugins = [
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  })
];

module.exports = config;
