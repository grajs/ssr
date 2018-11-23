export default (store, router) => {
  router.beforeEach((to, from, next) => {
    // 服务器store同步到浏览器
    if (typeof window !== 'undefined' && window.__INITIAL_STATE__) {
      store.replaceState(window.__INITIAL_STATE__)
    }
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
