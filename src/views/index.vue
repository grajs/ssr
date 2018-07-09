<template>
  <div>
    <h1>VueSSR</h1>
    <router-link to="/demo">TO-DEMO</router-link>
    <div class="container"></div>
    <ul>
      <li v-for="i in list" :key="i.id">{{i.name}}</li>
    </ul>
    <div>
      <button @click="$store.commit('loginIn','8888')">登录</button>
      <button @click="$store.commit('loginOut')">注销</button>
    </div>
    <img src="../assets/images/vue.jpg"/>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    asyncData({store}) {
      // return store.dispatch('fetchList')
    },
    computed: mapState(['list']),
    mounted() {
      // this.$axios('/cpp/api/plugin/info?name=highlight').then(data => {
      //   console.log(data)
      // }).catch(err => {
      //   console.log(err)
      // })
    }
  }
</script>

<style lang="scss">
  .container {
    @extend %demo;
  }
</style>