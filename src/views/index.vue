<template>
  <div>
    <h1>SSR-VUE</h1>
    <router-link to="/demo">TO-DEMO</router-link>
    <el-switch v-model="open">
    </el-switch>
    <div>
      <button @click="$store.commit('loginIn','8888')">登录</button>
      <button @click="$store.commit('loginOut')">注销</button>
    </div>
    <div>
      <ul>
        <li v-for="item in list">{{item.name}}</li>
      </ul>
    </div>
    <img src="../assets/images/vue.jpg"/>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    asyncData({ store }) {
      return store.dispatch('fetchList')
    },
    computed: mapState(['list']),
    data: function () {
      return {
        open: true
      }
    }
  }
</script>

<style lang="scss">
  i {
    font-size: 22px;
    width: 20px;
    height: 20px;
  }
</style>
