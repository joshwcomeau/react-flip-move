module.exports = {
  extends: [
    'eslint-config-alloy/typescript-react',
  ],
  parser: 'babel-eslint',
  rules: {
    'indent': [
      'error',
      2,
      {
        SwitchCase: 1,
        flatTernaryExpressions: true
      }
    ],
    'react/jsx-indent': [
      'error',
      2
    ],
    'react/jsx-indent-props': [
      'error',
      2
    ],
    'import/no-unresolved': 0,
    'import/no-extraneous-dependencies': 0,
    'react/jsx-filename-extension': 0,
    'react/no-unused-prop-types': 0,
    'react/sort-comp': 0,
    'no-console': [1, { allow: ['warn', 'error'] }],
    'no-plusplus': [1, { allowForLoopAfterthoughts: true }],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  env: {
    browser: true,
    node: true,
  },
};
