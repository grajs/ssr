export default (store) => {
  if (typeof document === 'undefined') {
    if (global._token) {
      store.commit('loginIn', global._token)
    } else {
      store.commit('loginOut')
    }
  } else {
    if (/token=[^;]+/.test(document.cookie)) {
      store.commit('loginIn', document.cookie.match(/(?<=token=)[^;]+/)[0])
    } else {
      store.commit('loginOut')
    }
  }
}