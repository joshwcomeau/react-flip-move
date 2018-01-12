const { NODE_ENV, BABEL_ENV } = process.env;
const test = NODE_ENV === 'test';
const modules = BABEL_ENV === 'cjs' || test ? 'commonjs' : false;
const loose = true;

module.exports = {
  "presets": [
    ["env", { modules, loose, targets: { uglify: true } }],
    "stage-0",
    "react",
    "flow",
  ],
  "plugins": [
    "transform-decorators-legacy",
    modules === 'commonjs' && "add-module-exports",
    test && ["istanbul", { "exclude": ["test/**/*.js"]}],
  ].filter(Boolean),
};
