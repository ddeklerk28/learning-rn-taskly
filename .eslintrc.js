// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier', 'react-native'],
  rules: {
    quotes: ['error', 'single'],
    'prettier/prettier': ['error', { singleQuote: true }],
    'react-native/no-unused-styles': 'error',
  },
};
