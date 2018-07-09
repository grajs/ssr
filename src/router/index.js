import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

export function createRouter() {
  const router = new Router({
    mode: 'history',
    routes,
    scrollBehavior: () => ({x: 0, y: 0})
  })
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      console.log(router.app.$options.store.state)
      if (router.app) {
        next()
      } else {
        next({
          path: '/login',
          query: {redirect: to.fullPath}
        })
      }
    } else {
      next()
    }
    if (to.matched.some(r => r.meta.title)) {
      typeof window !== 'undefined' && (document.title = to.meta.title)
      next()
    }
  })
  return router
}