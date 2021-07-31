<template>
  <div>
    <Header />
    <Nuxt />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Default'
})
</script>

<style lang="css">
html {
  font-size: 16px;
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  background: #181a1b;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
