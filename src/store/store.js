import axios from '../unitils/axios/fetch'

export default {
  state: {
    userName: '',
    token: undefined,
    list: []
  },
  mutations: {
    setUserName(state, name) {
      state.userName = name
    },
    setList(state, data) {
      state.list = data
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
    fetchList({commit}) {
      return axios('/api/web/api/area/hotArea/v1').then(({data}) => {
        commit('setList', data)
      }).catch(err => console.log(err))
    }
  }
}
