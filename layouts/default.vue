<template>
  <div>
    <Header @showPopup="popup = true" />
    <Nuxt keep-alive />
    <PlayerController />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from '~/store'

export default Vue.extend({
  name: 'Default',
  middleware({ route, redirect }) {
    // check access_token exist in route.query
    // if true, remove token data
    if (typeof route.query.access_token === 'string') {
      redirect(route.path)
    }
  },
  data() {
    return {
      popup: false
    }
  },
  computed: {
    accessToken() {
      return (this.$store as Store).getters.GET_TOKEN
    }
  }
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
  background: #000;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
