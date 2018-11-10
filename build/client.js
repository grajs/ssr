const resolve = path => require('path').resolve(__dirname, path)
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./base')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'

module.exports = merge(base, {
  entry: {
    app: (isProduction ? [] : ['webpack-hot-middleware/client']).concat(['babel-polyfill', resolve('../src/entry-client.js')])
  },
  optimization: isProduction ? {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        init: {
          name: 'init',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial'
        },
        elementUI: {
          name: 'elementUI',
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          priority: 20
        }
      }
    }
  } : {},
  plugins: [
    new VueSSRClientPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('../src/assets/images/favicon.ico'),
        to: resolve('../dist/favicon.ico')
      }
    ])
  ].concat(isProduction ? [] : [
    new webpack.HotModuleReplacementPlugin({ multiStep: true }),
    new webpack.NoEmitOnErrorsPlugin()
  ])
})
