module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'auto',
  },
  // always add prettier last, if multiple plugins used
  plugins: ['@typescript-eslint/eslint-plugin', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  // this configuration file is the root ESLint configuration file for the project
  root: true,
  // normally you won't need all of these, only those used in your project. But since we're comparing, we'll actually use all
  env: {
    node: true,
    jest: true,
  },
  // you could ignore some types of files
  ignorePatterns: ['.eslintrc.js'],
  // I want to include Prettier rules with ESLint, and turn off some of the default ESLint rules
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
