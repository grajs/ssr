const resolve = path => require('path').resolve(__dirname, path)
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const {VueLoaderPlugin} = require('vue-loader')
module.exports = {
  mode: 'production',
  output: {
    path: resolve('../dist'),
    filename: '[name].[chunkhash:8].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true,
          preserveWhitespace: false
        }
      },
      {
        test: /\.(gif|eot|ttf|woff2?|svgz?)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            name: 'assets/images/[name].[hash:8].[ext]',
            limit: 5000
          }
        }]
      },
      {
        test: /\.(png|jpe?g)$/i,
        use: [
          {
            loader: 'image-webp-loader',
            options: {
              outputPath: resolve('../dist'),
              name: `assets/images/[name].[hash:8].[ext]`,
              subQuality: {
                'vue.jpg': 90
              },
              requestType: 'img'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader',
          fallback: 'vue-style-loader'
        })
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'postcss-loader', 'sass-loader', {
            loader: 'sass-resources-loader',
            options: {
              resources: resolve('../src/assets/style/public.scss')
            }
          }],
          fallback: 'vue-style-loader'
        })
      },
      {test: /\.less$/, loader: ['style-loader', 'css-loader', 'less-loader']},
      {test: /\.js$/, loader: ['babel-loader'], exclude: /node_modules/}
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'extract.[chunkhash:8].css',
      allChunks: true
    }),
    new VueLoaderPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.css', '.vue'],
    alias: {
      '~': resolve('../src')
    }
  }
}
