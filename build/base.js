const resolve = path => require('path').resolve(__dirname, path)
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const isProduction = process.env.NODE_ENV === 'production'
module.exports = {
  mode: isProduction ? 'production' : 'development',
  output: {
    path: resolve('../dist'),
    filename: isProduction ? '[name].[chunkhash:8].js' : '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: isProduction ? {
          extractCSS: true,
          preserveWhitespace: false
        } : {}
      },
      {
        test: /\.(png|jpe?g|gif|eot|ttf|woff2?|svgz?)$/i,
        use: [{
          loader: 'url-loader',
          options: isProduction ? {
            name: 'assets/images/[name].[hash:8].[ext]',
            limit: 5000
          } : {
            name: `assets/images/[name].[ext]`
          }
        }]
      },
      {
        test: /\.css$/,
        use: isProduction ? ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader'],
          fallback: 'vue-style-loader'
        }) : ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: isProduction ? ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
          fallback: 'vue-style-loader'
        }) : ['vue-style-loader', 'css-loader', 'sass-loader']
      },
      { test: /\.js$/, loader: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ].concat(isProduction ? [new ExtractTextPlugin({
    filename: 'extract.[chunkhash:8].css',
    allChunks: true
  })] : []),
  resolve: {
    extensions: ['.js', '.json', '.css', '.vue'],
    alias: {
      '~': resolve('../src')
    }
  }
}
