module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    sourceMaps: api.env('production') ? false : 'inline',
    presets: ['@babel/env', '@babel/typescript'],
    ignore: [
      '**/__tests__',
      '**/__mocks__',
      '**/*.spec.ts',
      'src/test-setup.ts'
    ],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.es', '.es6', '.mjs', '.ts'],
          root: ['./src'],
          alias: {
            '~': './src'
          }
        }
      ],
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread'
    ].filter(Boolean)
  };
};
