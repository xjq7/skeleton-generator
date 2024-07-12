const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const cenv = process.env.cenv;
const tzPostcssLoader = cenv
  ? {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'postcss-pxtorem',
              {
                rootValue: 8, // 基准值，表示 1rem 对应的像素值
                unitPrecision: 2, // 小数点后保留的位数
                propList: ['*'],
              },
            ],
          ],
        },
      },
    }
  : undefined;

module.exports = (env, argv) => {
  const mode = argv.mode;
  const isDev = mode === 'development';

  return {
    entry: path.resolve(__dirname, 'index.tsx'),
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'skgen.toolkit.js',
    },
    devtool: false,
    devServer: {
      port: 8081,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          exclude: /node_modules/,
        },
        {
          test: /\.less$/i,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader', tzPostcssLoader, 'less-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src/'),
        '@components': path.resolve(__dirname, './components'),
      },
    },
    plugins: [
      new webpack.CleanPlugin(),
      isDev && new HtmlWebpackPlugin(),
      // new BundleAnalyzerPlugin(),
    ],
  };
};
