const pack = require('./package');
module.exports = {
  displayName: pack.name,
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '\\.[jt]sx?$': '../../tools/test/babel-transformer.js'
  },

  // Runs special logic, such as cleaning up components
  // when using React Testing Library and adds special
  // extended assertions to Jest
  setupFilesAfterEnv: [
    './src/test-setup.ts',
    '@testing-library/jest-dom/extend-expect'
  ],

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  modulePathIgnorePatterns: ['lib', 'build', 'dist', 'node_modules'],

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // Configure Jest to gracefully handle asset files such as stylesheets and
  // images. Usually, these files aren't particularly useful in tests so we can
  // safely mock them out
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/file-mock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/style-mock.js'
  }
};
