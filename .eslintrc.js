module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // set max line length to 120
    'max-len': ['error', { code: 120 }],
  },
};
