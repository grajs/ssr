import Vue from 'vue'
import App from './App'
import { createRouter } from './router'
import { createStore } from './store'
import { sync } from 'vuex-router-sync'
import routerControl from './router/router-control'
import axios from './utils/axios'
import elementUi from './utils/register-element-ui'
import './assets/style/common.css'

Vue.use(axios)
Vue.use(elementUi)

export function createApp() {
  const router = createRouter()
  const store = createStore()
  routerControl(store, router)
  sync(store, router)
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })
  return { app, router, store }
}
