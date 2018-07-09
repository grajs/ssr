<template>
  <div>
    登陆界面
  </div>
</template>

<script>
  export default {
    created() {
      console.log(this.$store.state.token, 'login页面token')
    }
  }
</script>

<style scoped>

</style>