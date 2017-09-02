module.exports = {
  resolve: {
    alias:
      process.env.REACT_IMPL === 'preact'
        ? {
            react: 'preact-compat',
            'react-dom': 'preact-compat',
            'create-react-class': 'preact-compat/lib/create-react-class',
          }
        : {},
  },
};
