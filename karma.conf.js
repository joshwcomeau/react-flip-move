// Karma configuration
// var webpack = require('webpack');

module.exports = function(config) {
  'use strict';

  var configuration = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    client: {
      mocha: {
        ui: 'bdd'
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'test/**/*.spec.js'
    ],


    webpack: {
      devtool: 'inline-source-map',

      module: {
        loaders: [
          {
            test:     /\.jsx?$/,
            loader:   'babel',
            exclude:  /node_modules/
          }
        ]
      }
    },


    // list of files to exclude
    exclude: [
    ],


    plugins: [
      require("karma-webpack"),
      'karma-mocha',
      'karma-sinon-chai',
      'karma-sourcemap-loader',
      'karma-chrome-launcher'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/**/*.js': ['webpack', 'sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  }

  if ( process.env.TRAVIS ) {
    configuration.browsers = ['Chrome_travis_ci'];
  }

  config.set(configuration);
}
