import { createApp } from './main'

export default context => {
  const { app, router, store } = createApp()
  store.commit('setToken', context.token)

  return new Promise((resolve, reject) => {
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      !matchedComponents.length && reject(404)

      // 将asyncData钩子加入到组件生命周期，包括子组件
      let asyncDataTask = []
      const searchSyncData = component => {
        component.asyncData && asyncDataTask.push(component.asyncData({ store, route: router.currentRoute }))
        // 递归遍历子组件
        if (component.components) {
          let components = component.components
          for (let i in components) {
            searchSyncData(components[i])
          }
        }
      }
      matchedComponents.forEach(i => searchSyncData(i))

      Promise.all(asyncDataTask).then(() => {
        context.state = store.state
        resolve(app)
      }).catch(reject)
    }, reject)
  })
}
