import Axios from 'axios'
import proxyConfig from '../../proxy-config'

const isNode = global && typeof window === 'undefined'

const fetch = (url, data = {}, method = 'get', formData = false) => new Promise((resolve, reject) => {

  // Node环境下无需代理，直接访问目标URL
  if (isNode) {
    proxyConfig.forEach(i => {
      const reg = new RegExp('^' + i.from)
      reg.test(url) && (url = url.replace(reg, i.to))
    })
  }

  let cancelToken = null
  if (data.cancelToken instanceof Axios.CancelToken) {
    cancelToken = data.cancelToken
    delete data.cancelToken
  }

  const config = {
    // headers: {'Authorization': store.state.token},
    url,
    method,
    params: method === 'get' ? data : null,
    cancelToken
  }

  // formData形式的请求
  if (formData === true) {
    if (isNode) {
      // node环境无法发送formData
      reject('Node Can\'t find FormData！Please use it in browser.')
      config.data = {}
    } else {
      const formData = new FormData()
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          formData.append(key, data[key])
        }
      }
      config.data = formData
    }
  } else {
    config.data = data
  }

  Axios(config).then(res => {
    if (res.status >= 200 && res.status < 400 && res.data.code === 0) {
      resolve(res.data.data)
    } else {
      reject(res.data.message)
    }
  }).catch(err => reject(err))
})

export default {
  fetch,
  install(Vue) {
    Vue.prototype.$axios = fetch
  }
}
