<template>
  <main
    class="
      flex
      w-full
      pt-16
      watch__container
      -lg:flex-col
      xl:px-14 xl:pt-24
      2xl:pt-26
      3xl:px-16 3xl:pt-28
    "
  >
    <!-- 影片 -->
    <section
      ref="player-slot"
      class="flex-grow flex items-center justify-center"
    ></section>

    <!-- 播放列表 -->
    <section
      class="
        flex
        text-white
        max-w-200
        w-[36%]
        justify-center
        items-start
        overflow-y-scroll
        lg:ml-12
        xl:ml-14
        3xl:ml-16
      "
    >
      <ul v-if="playerQueue.type === 'playlist'" class="list-none pl-0">
        <li
          v-for="item in playerQueue.data"
          :key="item.etag"
          class="flex w-full items-center justify-center"
        >
          <nuxt-link
            :to="{
              name: 'watch',
              query: {
                v: item.snippet.resourceId.videoId,
                list: $route.query.list
              }
            }"
            class="
              border-solid border-white
              flex
              border-0 border-b-1 border-opacity-10
              text-white
              w-full
              px-2
              no-underline
              items-center
              lg:h-14
            "
          >
            <img
              :src="item.snippet.thumbnails.default.url"
              alt=""
              class="h-8 mr-4 w-8"
            />
            <div class="flex-col inline-flex">
              <span
                class="font-medium text-sm mb-1 line-clamp-1 2xl:text-base"
                >{{ item.snippet.title }}</span
              >
              <span class="text-xs line-clamp-1">{{
                item.snippet.videoOwnerChannelTitle
              }}</span>
            </div>
          </nuxt-link>
        </li>
      </ul>
      <ul v-else class="list-none pl-0">
        <li
          v-for="item in playerQueue.data"
          :key="item.etag"
          class="flex w-full items-center justify-center"
        >
          <nuxt-link
            :to="{
              name: 'watch',
              query: {
                v: item.snippet.id
              }
            }"
            class="
              border-solid border-white
              flex
              border-0 border-b-1 border-opacity-10
              text-white
              w-full
              px-2
              no-underline
              items-center
              lg:h-14
            "
          >
            <img
              :src="item.snippet.thumbnails.default.url"
              alt=""
              class="h-8 mr-4 w-8"
            />
            <div class="flex-col inline-flex">
              <span
                class="font-medium text-sm mb-1 line-clamp-1 2xl:text-base"
                >{{ item.snippet.title }}</span
              >
              <span class="text-xs line-clamp-1">{{
                item.snippet.channelTitle
              }}</span>
            </div>
          </nuxt-link>
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { Store } from '~/store'

export default Vue.extend({
  name: 'Watch',
  meta: {
    Authentication: true
  },
  computed: {
    playerQueue() {
      return (this.$store as Store).getters['Player/GET_PLAYER_QUEUE']
    }
  },
  activated() {
    window.addEventListener('resize', this.setPlayerSlotStyle)
  },
  deactivated() {
    window.removeEventListener('resize', this.setPlayerSlotStyle)
  },
  mounted() {
    ;(this.$store as Store).commit(
      'Player/SET_PLAYER_SLOT_STYLE',
      this.$refs['player-slot'] as HTMLElement
    )
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setPlayerSlotStyle)
  },
  methods: {
    setPlayerSlotStyle() {
      ;(this.$store as Store).commit(
        'Player/SET_PLAYER_SLOT_STYLE',
        this.$refs['player-slot'] as HTMLElement
      )
    }
  }
})
</script>

<style lang="css" scoped>
.watch__container {
  height: calc(100vh - 64px - 64px);

  @media (min-width: 936px) {
    height: calc(100vh - 64px - 72px);
  }
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  position: relative;
  width: 10px;
  height: 10px;
  background: #f22;
  border-radius: 50%;
  transition: 0.2s;
}
</style>
