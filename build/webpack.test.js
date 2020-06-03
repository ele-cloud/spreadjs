const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const vueLoaderConfig = require('./vue-loader.conf');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, '../lib'),
    publicPath: '/dist/',
    filename: '[name].js',
    chunkFilename: '[id].js'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      main: path.resolve(__dirname, '../src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.less$ /,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.scss$ /,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader']
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin()
  ]
}
