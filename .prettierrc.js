// Documentation for this file: https://prettier.io/docs/en/configuration.html
module.exports = {
  // We use a larger print width because Prettier's word-wrapping seems to be
  // tuned for plain JavaScript without type annotations
  printWidth: 100,
  singleQuote: true,
  semi: true,
  // Preserve existing newlines
  endOfLine: 'auto',
  // For ES5, trailing commas cannot be used in function parameters; it is
  // counterintuitive to use them for arrays only
  trailingComma: 'none',
  // Print semicolons at the ends of statements
  semi: true,

  overrides: [
    {
      files: '*.js',
      options: {
        printWidth: 80
      }
    },
    {
      files: '*.json',
      options: {
        printWidth: 80
      }
    }
  ],
  plugins: ['prettier-plugin-package']
};
