<template>
  <div>
    登陆界面
  </div>
</template>

<script>
  export default {
    mounted() {
      console.log(this.$store.state.token)
    }
  }
</script>

<style scoped>

</style>