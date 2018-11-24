const fs = require('fs')
const { resolve } = require('path')
const LRU = require('lru-cache')
const cacheList = require('./cache-list')
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('../dist/vue-ssr-server-bundle')
const clientManifest = require('../dist/vue-ssr-client-manifest')
const template = fs.readFileSync(resolve(__dirname, '../src/template.html'), 'utf-8')

const webCache = LRU({ max: 200, maxAge: 1000 * 60 * 10 })

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template: template,
  clientManifest: clientManifest
})

const render = ctx => new Promise((resolve, reject) => {
  const context = { url: ctx.url, token: ctx.cookies.get('token') }
  const url = ctx.url
  // 缓存管理
  if (cacheList.has(url)) {
    if (!webCache.has(url)) {
      renderer.renderToString(context, (error, html) => {
        if (error) {
          reject(error)
        } else {
          webCache.set(url, html)
          resolve(html)
        }
      })
    } else {
      resolve(webCache.get(url))
    }
  } else {
    renderer.renderToString(context, (error, html) => {
      error ? reject(error) : resolve(html)
    })
  }
})

module.exports = render
