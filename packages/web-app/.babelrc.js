module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: ['@babel/env', '@babel/typescript', '@babel/react'],
    ignore: api.env('test')
      ? []
      : ['**/__tests__', '**/__mocks__', '**/*.spec.ts', 'src/test-setup.ts'],
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
      [
        'transform-define',
        {
          ENV_IS_PRODUCTION: api.env('production'),
          ENV_IS_DEVELOPMENT: !api.env('production'),
          ENV_IS_UNIT_TESTING: api.env('test'),
          APP_VERSION: JSON.stringify(require('./package.json').version),
          SITE_COOKIE_PREFERRED_COLOR_SCHEME:
            "'yarn-workspaces-analyzer-theme-tone'",
          DRAWER_WIDTH: 250
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
