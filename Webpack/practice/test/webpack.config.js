const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif)$/i,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name]_[hash:7].[ext]',
          context: 'project'
        }
      }
    }, {
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            importLoaders: 2,
            modules: true
          }
        },
        'sass-loader',
        {
          loader: 'postcss-loader',
          options: {
            ident: 'postcss',
          }
        }
      ]
    }, {
      test: /\.(eot|ttf|svg|woff)$/i,
      use: {
        loader: 'file-loader'
      }
    }]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  }
}