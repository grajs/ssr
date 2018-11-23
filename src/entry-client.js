import Vue from 'vue'
import progress from './components/progress'
import { createApp } from './main'

const processBar = Vue.prototype.$progress = new Vue(progress).$mount()
document.body.appendChild(processBar.$el)

const { app, router, store } = createApp()
router.onReady(() => {
  router.beforeResolve((to, from, next) => {
    // 若访问的是子路由getMatchedComponents结果length>1
    const matched = router.getMatchedComponents(to)
    const prevMatched = router.getMatchedComponents(from)
    let diffed = false
    // 多级路由从第一个不同路由组件开始渲染，避免重复渲染相同的父组件
    const activated = matched.filter((c, i) => {
      return diffed || (diffed = (prevMatched[i] !== c))
    })
    // 访问的是同一个路由直接next跳出
    if (!activated.length) {
      return next()
    }
    processBar.start()

    // 将asyncData钩子加入到组件生命周期，包括子组件
    let asyncDataTask = []
    const searchSyncData = component => {
      component.asyncData && asyncDataTask.push(component.asyncData({ store, route: to }))
      // 递归遍历子组件
      if (component.components) {
        let components = component.components
        for (let i in components) {
          searchSyncData(components[i])
        }
      }
    }
    activated.forEach(i => searchSyncData(i))

    Promise.all(asyncDataTask).then(() => {
      processBar.end()
      next()
    }).catch(next)
  })

  app.$mount('#app')
})
