module.exports = {
  root: true,
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'airbnb-typescript/base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 2020,
    'sourceType': 'module',
    'ecmaFeatures': {
      'modules': true
    },
    tsconfigRootDir: __dirname,
  }
};
