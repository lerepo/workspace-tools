/*
 * We use eslint basic for everything except TypeScript files. For TypeScript,
 * we use an override to parse with @typescript-eslint plugin.
 */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:json/recommended',
    'plugin:md/recommended',
    'plugin:security/recommended',
    'plugin:editorconfig/noconflict',
    'plugin:promise/recommended',
    'prettier'
  ],
  env: {
    node: 12,
    commonjs: true,
    es2020: true,
    browser: false,
    jest: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  ignorePatterns: ['__mocks__', 'dist', 'build', 'lib', 'CHANGELOG.md'],
  globals: {
    globalThis: false
  },
  plugins: [
    'md',
    'optimize-regex',
    'no-secrets',
    'security',
    'editorconfig',
    'json',
    'promise',
    'prettier',
    'react',
    'react-hooks'
  ],
  overrides: [
    {
      files: ['**/*.{ts,tsx}'],
      plugins: ['@typescript-eslint'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:json/recommended',
        'plugin:md/recommended',
        'plugin:security/recommended',
        'plugin:editorconfig/noconflict',
        'plugin:promise/recommended',
        'plugin:jest/recommended',
        'prettier'
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
          experimentalDecorators: true,
          experimentalObjectRestSpread: true,
          jsx: true
        },
        extraFileExtensions: ['.json', '.md']
      }
    },
    {
      files: ['**/*.{md,mkdn,mdown,markdown}'],
      parser: 'markdown-eslint-parser',
      rules: {
        'prettier/prettier': [
          'error',
          // Important to force prettier to use "markdown" parser - otherwise it
          // wouldn't be able to parse *.md files.
          // You also can configure other options supported by prettier here -
          // "prose-wrap" is particularly useful for *.md files
          { parser: 'markdown' }
        ]
      }
    },
    {
      files: ['*.md.js'], // Will match js code inside *.md files
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-undef': 'off'
      }
    }
  ],

  rules: {
    // JSON
    'json/*': ['error', 'allowComments'],

    // SECURITY
    'no-secrets/no-secrets': 'error',
    'security/detect-object-injection': 'off',

    // OTHER
    'optimize-regex/optimize-regex': 'warn',

    '@typescript-eslint/member-ordering': 'warn',

    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          String: {
            message: 'Use string instead',
            fixWith: 'string'
          },
          Boolean: {
            message: 'Use boolean instead',
            fixWith: 'boolean'
          },
          Number: {
            message: 'Use number instead',
            fixWith: 'number'
          }
        }
      }
    ],
    'react/prop-types': 0
  }
};
