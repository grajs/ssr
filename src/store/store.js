import axios from '../unitils/axios/fetch'

export default {
  state: {
    userName: '',
    token: '',
    list: []
  },
  mutations: {
    setUserName(state, name) {
      state.userName = name
    },
    setList(state, data) {
      state.list = data
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
