<template>
  <header
    class="
      flex
      h-20
      w-full
      px-4
      top-0
      right-0
      left-0
      z-99
      fixed
      items-center
      justify-between
      xl:h-16
    "
  >
    <NuxtLogo />

    <nav class="flex w-full right-0 absolute justify-center md:py-2">
      <ul v-if="!searching" class="flex list-none pl-0">
        <li v-for="item in navData" :key="item.title" class="lg:mx-6">
          <nuxt-link
            v-if="item.to"
            :to="item.to"
            class="
              flex
              font-medium
              h-full
              text-xl text-white
              leading-snug
              opacity-50
              no-underline
              items-center
              hover:opacity-100
            "
          >
            <span class="-lg:hidden">{{ item.title }}</span>
            <Icon
              :name="item.icon"
              class="
                fill-white
                md:h-6 md:my-3 md:mx-4 md:w-6 md:block
                -md:hidden
                lg:hidden
              "
            />
          </nuxt-link>

          <div
            v-else
            class="
              cursor-pointer
              flex
              font-medium
              h-full
              text-xl text-white
              leading-snug
              opacity-50
              no-underline
              items-center
              hover:opacity-100
            "
            @click="$emit('showPopup')"
          >
            <span class="-lg:hidden">{{ item.title }}</span>
            <Icon
              :name="item.icon"
              class="
                fill-white
                md:h-6 md:my-3 md:mx-4 md:w-6 md:block
                -md:hidden
                lg:hidden
              "
            />
          </div>
        </li>
      </ul>
      <div
        class="
          border-solid border-transparent
          cursor-pointer
          flex
          h-full
          border-1
          relative
          items-center
          -md:hidden
        "
        :class="{
          'bg-[#212121] !border-[#333]': searching,
          'opacity-50 hover:opacity-100': !searching
        }"
        @click.stop=""
      >
        <Icon
          :name="searching ? 'arrow' : 'magnify'"
          class="my-3 fill-white mx-4 md:h-6 md:w-6"
          @click.native="searching = !searching"
        />
        <span
          v-show="!searching"
          class="font-medium text-xl text-white leading-snug -lg:hidden"
          @click="searching = true"
          >搜尋</span
        >
        <input
          v-show="searching"
          v-model="search"
          type="text"
          class="
            bg-transparent
            border-none
            h-full
            outline-none
            text-white
            w-full
            lg:text-xl lg:leading-snug lg:pr-14 lg:w-180
            xl:w-215
          "
          placeholder="搜尋"
          @keydown.esc="searching = false"
        />
        <Icon
          v-show="search.length > 0 && searching"
          name="close"
          class="
            fill-white
            top-0
            right-0
            z-1
            absolute
            lg:h-6 lg:my-3 lg:mx-4 lg:w-6
          "
          @click.native="search = ''"
        />
      </div>
    </nav>

    <a
      ref="loginLink"
      href="/auth"
      class="
        bg-white
        rounded-sm
        cursor-pointer
        font-medium
        h-8
        text-sm
        px-4
        text-[#030303]
        z-99
        inline-flex
        items-center
        no-underline
      "
      >登入</a
    >
  </header>
</template>

<script lang="ts">
import { Route } from 'vue-router'
import Vue from 'vue'
import { Store } from '~/store'

interface NavData {
  title: string
  icon: string
  to: Partial<Route>
}

export default Vue.extend({
  name: 'Header',
  data() {
    return {
      navData: [
        {
          title: '首頁',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: '探索',
          icon: 'compass',
          to: null
        },
        {
          title: '媒體庫',
          icon: 'music-box-multiple',
          to: null
        }
      ] as NavData[],
      searching: false,
      search: ''
    }
  },
  computed: {
    accessToken() {
      return (this.$store as Store).getters.GET_TOKEN
    }
  },
  mounted() {
    window.addEventListener('click', () => {
      this.searching = false
    })
  }
})
</script>

<style lang="postcss" scoped>
.nuxt-link-exact-active {
  @apply !opacity-100;
}
</style>
