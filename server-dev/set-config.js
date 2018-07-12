const resolve = path => require('path').resolve(__dirname, path)
const webpack = require('webpack')
const vueRule = {
  test: /\.vue$/,
  loader: 'vue-loader'
}
const imageRule = {
  test: /\.(png|jpe?g|gif|eot|ttf|woff2?|svgz?)$/i,
  use: [{
    loader: 'url-loader',
    options: {
      name: `assets/images/[name].[ext]`,
      limit: 5000
    }
  }]
}
const cssRule = {
  test: /\.css$/,
  loader: ['vue-style-loader', 'css-loader', 'postcss-loader']
}
const scssRule = {
  test: /\.scss$/,
  use: ['vue-style-loader', 'css-loader', 'postcss-loader', 'sass-loader', {
    loader: 'sass-resources-loader',
    options: {
      resources: [resolve('../src/assets/style/public.scss')]
    }
  }]
}
module.exports = (clientConfig, serverConfig) => {
  clientConfig.mode = serverConfig.mode = 'development'
  clientConfig.entry.app = ['webpack-hot-middleware/client'].concat(clientConfig.entry.app)
  clientConfig.output.filename = serverConfig.output.filename = '[name].js'
  clientConfig.module.rules.splice(0, 5, vueRule, imageRule, cssRule, scssRule)
  serverConfig.module.rules.splice(0, 5, vueRule, imageRule, cssRule, scssRule)
  clientConfig.plugins.splice(0, 2)
  serverConfig.plugins.shift(0, 2)
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin({multiStep: true}),
    new webpack.NoEmitOnErrorsPlugin()
  )
}
