module.exports = (api) => {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);
  return {
    presets: [
      ['@babel/preset-env', { targets: { node: 16 } }],
      '@babel/preset-typescript'
    ],
    plugins: [
      process.env.NODE_ENV != 'test' && [
        'module-resolver',
        {
          extensions: ['.js', '.es', '.es6', '.mjs', '.ts'],
          root: ['./src'],
          alias: {
            '@': './src'
          }
        }
      ]
    ]
  };
};
