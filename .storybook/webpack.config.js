const reactImpl = process.env.REACT_IMPL;

const alias = reactImpl ? {
  "react": reactImpl,
  "react-dom": reactImpl,
} : {};

module.exports = {
  resolve: { alias }
};
