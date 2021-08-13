<template>
  <div>
    <Header @showPopup="popup = true" />
    <Nuxt keep-alive />
    <PlayerController />
    <div
      v-show="popup"
      ref="loginPopup"
      class="
        bg-black
        flex
        bg-opacity-40
        top-0
        right-0
        bottom-0
        left-0
        z-100
        fixed
        filter
        blur-md
        items-center
        justify-center
      "
    >
      <div
        class="
          rounded-md
          flex flex-col
          bg-gray-900
          h-70
          text-white
          max-w-94vw
          p-5
          px-8
          w-100
          relative
          items-center
          justify-center
        "
      >
        <div class="h-15 p-5 top-0 right-0 left-0 absolute">
          <NuxtLogo class="" />
        </div>
        <span class="font-bold mt-auto text-xl text-white"
          >功能尚在開發中，敬請期待！</span
        >

        <div class="mt-auto mb-0 self-end" @click="popup = false">
          <span
            class="
              bg-white
              rounded-sm
              cursor-pointer
              font-medium
              h-8
              text-sm
              px-4
              text-[#030303]
              inline-flex
              items-center
              no-underline
              whitespace-nowrap
            "
            >確認</span
          >
        </div>
      </div>
    </div>
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
