import Vue from 'vue'
import App from './App'
import { createRouter } from './router/index'
import { createStore } from './store/index'
import { sync } from 'vuex-router-sync'
import routerControl from './router/router-control'
import axios from './utils/axios/index'
import { Message } from 'element-ui'
import 'font-awesome/css/font-awesome.min.css'
import './assets/style/common.css'

Vue.use(axios)
Vue.prototype.$message = Message

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
