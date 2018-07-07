const resolve = path => require('path').resolve(__dirname, path)
const merge = require('webpack-merge')
const base = require('./base')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(base, {
  entry: {
    app: ['babel-polyfill', resolve('../src/entry-client.js')]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        manifest: {
          test: /[\\/]node_modules[\\/]/,
          name: 'manifest',
          chunks: 'all'
        }
      }
    }
  },
  plugins: [
    new VueSSRClientPlugin(),
    new CopyWebpackPlugin([
      {
        from: resolve('../src/assets/images/favicon.ico'),
        to: resolve('../dist/favicon.ico')
      }
    ])
  ]
})
