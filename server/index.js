const {resolve} = require('path')
const fs = require('fs')
const Koa = require('koa')
const server = require('koa-static')
const mount = require('koa-mount')
const router = require('./router')
const proxy = require('koa-better-http-proxy')
const proxyConfig = require('../proxy-config')
const resolvePath = require('./resolve-path')
const OS = /:\\/.test(__dirname) ? 'win' : 'linux'
const app = new Koa()
app.use(async (ctx, next) => {
  if (/\.img$/.test(ctx.url) || /\.img\?/.test(ctx.url)) {
    if (/webp=1/.test(ctx.header.cookie)) {
      ctx.url = ctx.url.replace(/\.img/, '.webp')
    } else {
      const targetUrl = resolvePath(ctx.url, OS)
      ctx.url = targetUrl ? targetUrl : ctx.url
    }
  }
  await next()
})
app.use(server(resolve(__dirname, '../dist'), {index: 'default', maxage: 1000 * 60 * 60 * 24 * 30, immutable: true}))
app.use(router.routes()).use(router.allowedMethods())
let reg = '^('
proxyConfig.forEach(i => reg += `${i.from}|`)
reg = reg.replace(/\|$/, ')')
app.use(async (ctx, next) => {
  if (!new RegExp(reg).test(ctx.url)) {
    ctx.body = '404页面'
  } else {
    await next()
  }
})
proxyConfig.forEach(i => {
  app.use(mount(i.from, proxy(i.to, {
    preserveReqSession: true
  })))
})
app.listen(8080, () => console.log('Web Run In https://localhost:8080'))