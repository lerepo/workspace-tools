module.exports = {
  // Jest transformations -- this adds support for TypeScript
  // using ts-jest
  transform: {
    '\\.[jt]sx?$': '../../tools/babel-jest/monorepo-transformer.js'
  },

  // Test spec file resolution pattern
  // Matches parent folder `__tests__` and filename
  // should contain `test` or `spec`.
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',

  modulePathIgnorePatterns: ['lib', 'build', 'dist'],

  // Module file extensions for importing
  moduleFileExtensions: ['ts', 'js', 'json', 'node']
};
