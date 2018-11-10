import syncState from '../utils/sync-state'

export default (store, router) => {
  router.beforeEach((to, from, next) => {
    syncState(store)
    if (to.matched.some(record => record.meta.title && typeof document !== 'undefined')) {
      document.title = to.meta.title
    }
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.state.token) {
        next()
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath },
          replace: true
        })
      }
    } else {
      next()
    }
  })
}
