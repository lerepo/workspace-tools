module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: ['@babel/env', '@babel/typescript', '@babel/react'],
    plugins: [
      [
        'module-resolver',
        {
          extensions: ['.js', '.es', '.es6', '.mjs', '.ts', '.tsx', '.png'],
          root: ['./src'],
          alias: {
            '~': './src'
          }
        }
      ],
      // Enable tree-shaking for @blueprintjs/core
      // ['import', { libraryName: '@blueprintjs/core', libraryDirectory: 'lib/esm/components' }],
      '@babel/proposal-class-properties',
      '@babel/proposal-object-rest-spread',
      '@babel/plugin-proposal-optional-chaining',
      // Applies the react-refresh Babel plugin on non-production modes only
      api.env('development') && 'react-refresh/babel'
    ].filter(Boolean)
  };
};
