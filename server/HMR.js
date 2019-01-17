const { readFileSync } = require('fs')
const { join } = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const webpackDev = require('webpack-dev-middleware')
const webpackHot = require('webpack-hot-middleware')
const clientConfig = require('../build/client')
const serverConfig = require('../build/server')

const readFile = (fs, file) => fs.readFileSync(join(clientConfig.output.path, file), 'utf-8')

module.exports = function setupDevServer(app, templatePath, createRender) {
  let bundle = null
  let clientManifest = null
  let template = readFileSync(templatePath, 'utf-8')

  let ready = null

  const update = () => {
    if (bundle && clientManifest) {
      ready()
      createRender(bundle, { template, clientManifest })
    }
  }

  chokidar.watch(templatePath).on('change', () => {
    template = readFileSync(templatePath, 'utf-8')
    update()
  })

  const clientCompiler = webpack(clientConfig)
  const devMiddleware = webpackDev(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true
  })

  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return false
    clientManifest = JSON.parse(readFile(devMiddleware.fileSystem, 'vue-ssr-client-manifest.json'))
    update()
  })

  const koaDevMiddleware = devMiddleware => {
    return (ctx, next) => {
      return new Promise((resolve) => {
        const option = {
          end: content => {
            ctx.body = content
            resolve(false)
          },
          setHeader: (name, value) => ctx.set(name, value)
        }
        devMiddleware(ctx.req, option, () => resolve(true))
      }).then(err => err ? next() : null)
    }
  }

  const koaHotMiddleware = hotMiddleware => (ctx, next) => {
    return new Promise(resolve => {
      hotMiddleware(ctx.req, ctx.res, resolve)
    }).then(next)
  }

  app.use(koaDevMiddleware(devMiddleware))
  app.use(koaHotMiddleware(webpackHot(clientCompiler, { heartbeat: 5000 })))

  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return false
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    update()
  })

  return new Promise(resolve => {
    ready = resolve
  })
}
