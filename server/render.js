const fs = require('fs')
const LRU = require('lru-cache')
const { createBundleRenderer } = require('vue-server-renderer')
const HMR = require('./HMR')

const isDevelopment = process.env.NODE_ENV === 'development'

const templateHtmlPath = require('path').resolve(__dirname, '../src/template.html')
const template = fs.readFileSync(templateHtmlPath, 'utf-8')

const createRender = app => {
  const webCache = LRU({ max: 200, maxAge: 1000 * 60 * 10 })
  let renderer = null
  let devRender = Promise.resolve()

  if (isDevelopment) {
    const createRenderer = (bundle, options) => createBundleRenderer(bundle, Object.assign(options, { runInNewContext: false }))
    devRender = HMR(app, templateHtmlPath, (bundle, options) => renderer = createRenderer(bundle, options))
  } else {
    const serverBundle = require('../dist/vue-ssr-server-bundle')
    const clientManifest = require('../dist/vue-ssr-client-manifest')
    renderer = createBundleRenderer(serverBundle, {
      runInNewContext: false,
      template,
      clientManifest: clientManifest
    })
  }

  const render = ctx => new Promise((resolve, reject) => {
    const url = ctx.url
    const context = { url, token: ctx.cookies.get('token') }
    const toRender = (setCache) => {
      renderer.renderToString(context, (error, html) => {
        if (error) {
          return reject(error)
        }
        setCache && webCache.set(url, html)
        resolve(html)
      })
    }
    // 缓存管理
    if (isDevelopment) {
      toRender()
    } else {
      if (webCache.has(url)) {
        resolve(webCache.get(url))
      } else {
        toRender(true)
      }
    }
  })
  return { render, devRender }
}

module.exports = createRender
