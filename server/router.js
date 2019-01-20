const Router = require('koa-router')
const createRender = require('./render')
const router = new Router()

const isDevelopment = process.env.NODE_ENV === 'development'

const creatRouter = app => {
  const render = createRender(app)
  router.get('*', async (ctx, next) => {
    ctx.type = 'html'
    isDevelopment && await render.devRender
    const html = await render.render(ctx).catch(error => error !== 404 && console.log(error))
    if (html) {
      ctx.body = html
    } else {
      await next()
    }
  })
  return router
}
module.exports = creatRouter
