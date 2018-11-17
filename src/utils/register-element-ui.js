import {
  Message,
  Switch
} from 'element-ui'

export default {
  install(Vue) {
    Vue.prototype.$message = {
      success: message => Message({ type: 'success', message }),
      info: message => Message({ type: 'info', message }),
      warning: message => Message({ type: 'warning', message }),
      error: message => Message({ type: 'error', message })
    }

    Vue.component(Switch.name, Switch)
  }
}
