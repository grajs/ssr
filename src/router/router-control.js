export default (store, router) => {
  router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (store.state.token) {
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
}