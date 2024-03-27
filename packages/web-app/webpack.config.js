/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

require('dotenv').config();

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env, options) => {
  const isEnvDevelopment = process.env.NODE_ENV === 'development';
  const isEnvProduction = process.env.NODE_ENV === 'production';
  const isEnvProductionProfile = isEnvProduction && options.profile;

  const useBundleAnalyzer = process.env.WITH_BUNDLE_ANALYZER === 'true';

  // Source maps are resource heavy and can cause out of memory issue for large
  // source files.
  const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';

  // style files regexes
  const cssRegex = /\.css$/;
  const cssModuleRegex = /\.module\.css$/;
  const sassRegex = /\.(scss|sass)$/;
  const sassModuleRegex = /\.module\.(scss|sass)$/;

  const imageInlineSizeLimit = parseInt(
    process.env.IMAGE_INLINE_SIZE_LIMIT || '10000'
  );

  // common function to get style loaders
  const getStyleLoaders = (
    cssOptions,
    preProcessor,
    preprocessorOptions = {}
  ) => {
    const loaders = [
      isEnvDevelopment && 'style-loader',
      isEnvProduction && MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: cssOptions
      },
      {
        // Options for PostCSS as we reference these options twice
        // Adds vendor prefixing based on your specified browser support in
        // package.json
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            // Necessary for external CSS imports to work
            // https://github.com/facebook/create-react-app/issues/2677
            ident: 'postcss',
            plugins: () => [
              require('postcss-flexbugs-fixes'),
              require('postcss-preset-env')({
                autoprefixer: {
                  flexbox: 'no-2009'
                },
                stage: 3
              }),
              // Adds PostCSS Normalize as the reset css with default options,
              // so that it honors browserslist config in package.json
              // which in turn let's users customize the target behavior as per their needs.
              require('postcss-normalize')
            ],
            sourceMap: isEnvProduction && shouldUseSourceMap
          }
        }
      }
    ].filter(Boolean);
    if (preProcessor) {
      loaders.push(
        {
          loader: 'resolve-url-loader',
          options: {
            sourceMap: isEnvProduction && shouldUseSourceMap
          }
        },
        {
          loader: preProcessor,
          options: Object.assign(
            {
              sourceMap: true
            },
            preprocessorOptions
          )
        }
      );
    }
    return loaders;
  };

  return {
    mode: isEnvProduction ? 'production' : isEnvDevelopment && 'development',
    bail: isEnvProduction,
    // The application entry point
    entry: {
      app: [path.resolve(__dirname, 'src', 'index.tsx')]
    },

    // Where to compile the bundle
    // By default the output directory is `dist`
    output: {
      path: path.resolve(__dirname, 'dist'),
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/[name].js',
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      publicPath: '/',
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isEnvDevelopment,
      // this defaults to 'window', but by setting it to 'this' then
      // module chunks which are built will work in web workers as well.
      globalObject: 'this'
    },

    devtool: isEnvProduction
      ? shouldUseSourceMap
        ? 'source-map'
        : false
      : isEnvDevelopment && 'cheap-module-source-map',

    devServer: {
      port: 3000,
      historyApiFallback: true,
      hot: true,
      // Send API requests on localhost to API server get around CORS.
      proxy: [
        {
          context: '/api',
          target: 'http://localhost:32221'
        }
      ]
    },

    resolve: {
      // Add '.ts' and '.tsx' as resolvable extensions.
      extensions: ['.ts', '.tsx', '.mjs', '.cjs', '.js'],
      plugins: [PnpWebpackPlugin]
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)]
    },

    module: {
      rules: [
        // Fix: BREAKING CHANGE: The request './objectWithoutPropertiesLoose'
        // failed to resolve only because it was resolved as fully specified
        {
          test: /\.m?js/,
          resolve: { fullySpecified: false }
        },
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            // "url" loader works like "file" loader except that it embeds
            // assets smaller than specified limit in bytes as data URLs to
            // avoid requests.
            {
              test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
              loader: 'url-loader',
              options: {
                limit: imageInlineSizeLimit,
                name: 'static/media/[name].[hash:8].[ext]'
              }
            },
            {
              test: /\.ts(x?)$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                rootMode: 'upward',
                // Enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
                // DO NOT apply the Babel plugin in production mode!
                plugins: [
                  isEnvDevelopment && require.resolve('react-refresh/babel')
                ].filter(Boolean)
              }
            },
            {
              test: cssRegex,
              exclude: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap
              }),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true
            },
            // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
            // using the extension .module.css
            {
              test: cssModuleRegex,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: true
              })
            },
            {
              test: sassRegex,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                  modules: {
                    auto: sassModuleRegex,
                    mode: 'local',
                    localIdentName: isEnvProduction
                      ? '[hash:base64:5]'
                      : '[path][name]___[local]'
                  }
                },
                'sass-loader',
                {
                  // Prefer `dart-sass`
                  implementation: require('sass')
                }
              ),
              // Don't consider CSS imports dead code even if the
              // containing package claims to have no side effects.
              // Remove this when webpack adds a warning or an error for this.
              // See https://github.com/webpack/webpack/issues/6571
              sideEffects: true
            },
            {
              // eslint-disable-next-line security/detect-unsafe-regex
              test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
              use: [
                {
                  loader: 'file-loader',
                  options: {
                    name: '[name].[ext]',
                    outputPath: 'static/fonts/'
                  }
                }
              ]
            },
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              loader: 'file-loader',
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: '[name].[hash:8].[ext]',
                outputPath: 'static/media/'
              }
            }
          ]
        }
      ]
    },
    optimization: {
      minimize: isEnvProduction,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2
            },
            mangle: {
              safari10: true
            },
            // Added for profiling in devtools
            keep_classnames: isEnvProductionProfile,
            keep_fnames: isEnvProductionProfile,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true
            }
          }
        })
      ],
      // Automatically split vendor and commons
      // https://twitter.com/wSokra/status/969633336732905474
      splitChunks: {
        chunks: 'all',
        name: false
      },
      // Keep the runtime chunk separated to enable long term caching
      // https://twitter.com/wSokra/status/969679223278505985
      // https://github.com/facebook/create-react-app/issues/5358
      runtimeChunk: {
        name: (entrypoint) => `runtime-${entrypoint.name}`
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: '**/*',
            to: 'static/',
            context: path.resolve(__dirname, 'public'),
            globOptions: {
              ignore: ['**/index.html']
            }
          }
        ]
      }),
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html'
      }),
      // TypeScript type checking
      new ForkTsCheckerWebpackPlugin({
        async: isEnvDevelopment,
        typescript: {
          configFile: 'tsconfig.app.json',
          mode: 'write-references',
          diagnosticOptions: {
            syntactic: true,
            semantic: true,
            declaration: true,
            global: true
          }
        }
      }),
      new MiniCssExtractPlugin({
        filename: isEnvDevelopment
          ? 'static/css/[name].css'
          : 'static/css/[name].[contenthash:8].css',
        chunkFilename: isEnvDevelopment
          ? 'static/css/[id].css'
          : 'static/css/[id].[contenthash:8].css'
      }),
      isEnvDevelopment && new ReactRefreshWebpackPlugin(),
      useBundleAnalyzer && new BundleAnalyzerPlugin()
    ].filter(Boolean)
  };
};
