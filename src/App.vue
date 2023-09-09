<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  max-width: 1024px; /*全局最大宽度*/
  margin: 0 auto; /*居中*/
}
</style>
