module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: ['@babel/env', '@babel/typescript', '@babel/react'],
    plugins: [
      process.env.NODE_ENV != 'test' && [
        'module-resolver',
        {
          extensions: ['.js', '.es', '.es6', '.mjs', '.ts', '.tsx', '.png'],
          root: ['./src'],
          alias: {
            '@': './src'
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
      '@babel/plugin-transform-optional-chaining'
    ].filter(Boolean)
  };
};
