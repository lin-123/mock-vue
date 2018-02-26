const path = require('path');
const webpack = require('webpack')
const merge = require('webpack-merge')

const webpackConfig = {
  entry: {
    app: './src/index.js',
  },
  devtool: '#inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        }
      },
    ]
  },
  output: {
    filename: 'seed.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    libraryTarget: "umd",
    library: "Seed"
  },
  plugins: []
};


module.exports = webpackConfig