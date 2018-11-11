import axios from '../utils/axios'

const fetch = axios.fetch

export default {
  state: {
    token: undefined,
    list: []
  },
  mutations: {
    setList(state, list) {
      state.list = list
    },
    loginIn(state, token) {
      state.token = token
      if (typeof document !== 'undefined') {
        document.cookie = `token=${token}`
      }
    },
    loginOut(state) {
      state.token = undefined
      if (typeof document !== 'undefined') {
        const now = new Date()
        now.setTime(now.getTime() - 1)
        document.cookie = `token='';expires=${now.toUTCString()}`
      }
    }
  },
  actions: {
    fetchList({ commit }) {
      return fetch('/api/data').then(list => {
        commit('setList', list)
      }).catch(err => console.log(err))
    }
  }
}
