<template>
  <div>
    <h1>VueSSR-DEMO</h1>
    <router-link to="/">index</router-link>
  </div>
</template>

<script>
  export default {
    create() {
      console.log(this.$store.state.token)
    }
  }
</script>

<style>

</style>