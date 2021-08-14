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
      id="player-slot"
      ref="player-slot"
      class="
        flex-grow flex
        items-center
        justify-center
        -lg:flex-shrink-0 -lg:h-56vw -lg:w-full
      "
    ></section>

    <!-- 播放列表 -->
    <section
      class="
        flex
        text-white
        justify-center
        items-start
        overflow-y-scroll
        lg:ml-12 lg:max-w-200 lg:w-[36%]
        -lg:w-full
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
              -lg:h-57px
            "
          >
            <img
              :src="getThumbnail(item.snippet.thumbnails)"
              alt=""
              class="h-8 mr-4 w-8"
            />
            <div class="flex-col inline-flex">
              <span
                class="
                  font-medium
                  text-sm
                  mb-1
                  leading-18px
                  line-clamp-1
                  2xl:text-base
                "
                >{{ item.snippet.title }}</span
              >
              <span class="text-xs leading-18px line-clamp-1">{{
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
                v: item.id
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
              -lg:h-57px
            "
          >
            <img
              :src="getThumbnail(item.snippet.thumbnails)"
              alt=""
              class="h-8 mr-4 w-8"
            />
            <div class="flex-col inline-flex">
              <span
                class="
                  font-medium
                  text-sm
                  mb-1
                  leading-18px
                  line-clamp-1
                  2xl:text-base
                "
                >{{ item.snippet.title }}</span
              >
              <span class="text-xs leading-18px line-clamp-1">{{
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
import { Thumbnails } from '~/@types'
import { Store } from '~/store'
import { PlayerActionTypes } from '~/store/Player/actions'
import { PlayerGetterTypes } from '~/store/Player/getters'
import { PlayerMutationTypes } from '~/store/Player/mutations'
import { getThumbnail } from '~/utilities'

export default Vue.extend({
  name: 'Watch',
  meta: {
    Authentication: true
  },
  computed: {
    playerQueue() {
      return (this.$store as Store).getters[PlayerGetterTypes.GET_PLAYER_QUEUE]
    }
  },
  activated() {
    this.setPlayerSlotStyle()
    window.addEventListener('resize', this.setPlayerSlotStyle)
    ;(this.$store as Store).dispatch(PlayerActionTypes.FETCH_PLAYER_QUEUE, {
      playlistId: this.$route.query.list as string | undefined,
      videoId: this.$route.query.v as string
    })
  },
  deactivated() {
    window.removeEventListener('resize', this.setPlayerSlotStyle)
  },
  mounted() {
    // load youtube iframe api
    // LINK https://developers.google.com/youtube/iframe_api_reference
    ;(window as any).onYouTubeIframeAPIReady = () => {
      setTimeout(() => {
        ;(this.$store as Store).dispatch(
          PlayerActionTypes.PLAYER_INIT,
          `${this.$route.query.v}`
        )
      }, 400)
    }
  },
  updated() {
    this.setPlayerSlotStyle()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setPlayerSlotStyle)
  },
  methods: {
    setPlayerSlotStyle() {
      ;(this.$store as Store).commit(
        PlayerMutationTypes.SET_PLAYER_SLOT_STYLE,
        this.$refs['player-slot'] as HTMLElement
      )
    },
    getThumbnail(thumbnails: Thumbnails) {
      return getThumbnail(thumbnails)
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

  @media (max-width: 936px) {
    height: calc(100vh - 64px);
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
