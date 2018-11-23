import axios from '../utils/axios'
import Cookie from 'js-cookie'

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
    setToken(state, token) {
      state.token = token
      if (typeof document !== 'undefined') {
        if (token) {
          Cookie.set('token', token)
        } else {
          Cookie.remove('token')
        }
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
