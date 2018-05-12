const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  JS: path.resolve(__dirname, 'frontend/pages'),
};
// Webpack configuration
module.exports = {
  entry: {
    movies: ['babel-polyfill', path.join(paths.JS, 'index.js')],
    'movie-player': ['babel-polyfill', path.join(paths.JS, 'movie-player.js')],
  },
  output: {
    path: paths.DIST,
    filename: '[name].bundle.js',
  },
  devtool: 'inline-source-map',
  plugins: [
    new Dotenv(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: "'production'",
      },
    }),
    new UglifyJsPlugin(),
  ],
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
};