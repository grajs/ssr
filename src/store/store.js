import axios from '../unitils/axios/fetch'

export default {
  state: {
    userName: '',
    token: null,
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
    },
    loginOut(state) {
      state.token = null
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
