var jsdom = require('jsdom');


// Get a DOM!
// We need some CSS so that we can track the effects of our animation.
const DOM = `
  <!doctype html>
  <html>
  <head>
    <style type="text/css">
      * { box-sizing: border-box }
      li { position: relative; height: 100px;}
    </style>
  </head>
  <body></body>
  </html>
`;

global.document   = jsdom.jsdom(DOM);
global.window     = document.defaultView;
global.navigator  = { userAgent: 'node.js' };
