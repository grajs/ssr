const load = component => () => import(`../views/${component}.vue`)
export default [
  {
    path: '/',
    component: load('index'),
    meta: { keepAlive: true, title: '首页' }
  },
  {
    path: '/demo',
    component: load('demo'),
    meta: { title: 'demo', requiresAuth: true }
  },
  {
    path: '/login',
    component: load('login'),
    meta: { title: 'login' }
  }
]
