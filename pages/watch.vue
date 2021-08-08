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
    <section class="flex-grow flex items-center justify-center">
      <div
        id="player"
        class="
          flex
          h-full
          text-white
          w-full
          z-0
          justify-center
          items-center
          relative
        "
      />
    </section>

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

    <aside
      class="
        flex
        w-full
        right-0
        bottom-0
        left-0
        fixed
        justify-between
        items-center
        absolute
        lg:h-18
        -lg:h-16
      "
    >
      <input
        id="progress"
        v-model="progress"
        type="range"
        name="progress"
        class="
          border-none
          cursor-pointer
          outline-none
          h-1
          w-full
          transition-all
          -top-2px
          transition-300
          appearance-none
          absolute
          overflow-hidden
        "
        step="1"
        min="0"
        :max="durations.time"
        :style="`background-image: linear-gradient(to right, #f00 0%, #f00 ${
          (progress * 100) / durations.time
        }%, #bdbdbd ${(progress * 100) / durations.time}%)`"
      />
      <!-- left controls -->
      <div class="flex-shrink-0 inline-flex items-center justify-center">
        <div
          class="cursor-pointer h-10 ml-2 p-2 w-10"
          role="button"
          aria-label="上一首歌"
          title="上一首歌"
          @click.prevent=""
        >
          <Icon name="skip-previous" class="h-full fill-white w-full" />
        </div>
        <div
          v-show="playerStatus === 'pause'"
          ref="play"
          class="cursor-pointer h-12 ml-2 p-2 w-12"
          role="button"
          aria-label="播放"
          title="播放"
        >
          <Icon name="play" class="h-full fill-white w-full" />
        </div>
        <div
          v-show="playerStatus === 'play'"
          ref="pause"
          class="cursor-pointer h-12 ml-2 p-2 w-12"
          role="button"
          aria-label="暫停"
          title="暫停"
        >
          <Icon name="pause" class="h-full fill-white w-full" />
        </div>
        <div
          class="cursor-pointer h-10 ml-2 p-2 w-10"
          role="button"
          aria-label="下一首歌"
          title="下一首歌"
          @click.prevent=""
        >
          <Icon name="skip-next" class="h-full fill-white w-full" />
        </div>
        <span class="font-normal mr-4 text-xs ml-2 text-gray-400 -lg:hidden">
          {{ (currentTime.minutes > 10 ? '' : '0') + currentTime.minutes }}:{{
            (currentTime.seconds > 10 ? '' : '0') + currentTime.seconds
          }}&nbsp;/&nbsp;{{ durations.timeString }}
        </span>
      </div>

      <!-- middle controls -->
      <div class="inline-flex items-center justify-center">
        <img
          class="h-10 w-auto -lg:hidden"
          :src="`https://i.ytimg.com/vi/${$route.query.v}/default.jpg`"
          alt=""
        />

        <div class="flex flex-col flex-1 mr-2 text-white ml-4">
          <span class="font-medium line-clamp-1 lg:text-sm 2xl:text-base">{{
            info ? info.snippet.title : ''
          }}</span>
          <span class="text-xs line-clamp-1">{{
            info ? info.snippet.channelTitle : ''
          }}</span>
        </div>

        <div class="flex flex-shrink-0 -lg:hidden">
          <div
            class="h-10 mr-2 p-2 w-10"
            role="button"
            title="喜歡"
            aria-label="喜歡"
          >
            <Icon
              name="thumb-up-outline"
              class="cursor-pointer h-full fill-white w-full"
            />
          </div>
          <div
            class="h-10 p-2 w-10"
            role="button"
            title="不喜歡"
            aria-label="不喜歡"
          >
            <Icon
              name="thumb-down-outline"
              class="cursor-pointer h-full fill-white w-full"
            />
          </div>
        </div>
      </div>

      <!-- right controls -->
      <div class="mr-1 inline-flex items-center justify-center">
        <div
          class="cursor-pointer h-10 p-2 w-10"
          :aria-label="
            $route.name === 'watch' ? '關閉播放器頁面' : '開啟播放器頁面'
          "
          role="button"
        >
          <Icon
            name="play"
            class="
              h-full
              fill-white
              w-full
              transform
              transition-transform
              duration-300
            "
            :class="{
              'rotate-90': $route.name === 'watch',
              '-rotate-90': $route.name !== 'watch'
            }"
          />
        </div>
      </div>
    </aside>
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
  async fetch() {
    await (this.$store as Store).dispatch('Player/FETCH_VIDEO_INFO', {
      v: this.$route.query.v as string,
      playlistId: this.$route.query.list as string | null | undefined
    })
    ;(this.$store as Store).commit(
      'Player/SET_DURATIONS',
      this.info!.contentDetails.duration
    )
    ;(this.$store as Store).commit('Player/SET_PROGRESS', 0)
  },
  computed: {
    info() {
      return (this.$store as Store).getters['Player/GET_CURRENT_VIDEO_INFO']
    },
    currentTime() {
      return (this.$store as Store).getters['Player/GET_CURRENT_TIME']
    },
    durations() {
      return (this.$store as Store).getters['Player/GET_DURATIONS']
    },
    progress: {
      get() {
        return (this.$store as Store).getters['Player/GET_PROGRESS']
      },
      set(value: number) {
        return (this.$store as Store).dispatch('Player/SEEK_TO', value)
      }
    },
    playerStatus() {
      return (this.$store as Store).getters['Player/GET_PLAYER_STATUS']
    },
    playlist() {
      return (this.$store as Store).getters['Player/GET_PLAYLIST']
    },
    videos() {
      return (this.$store as Store).getters['Player/GET_VIDEOS']
    },
    playerQueue() {
      return (this.$store as Store).getters['Player/GET_PLAYER_QUEUE']
    }
  },
  watch: {
    async $route() {
      if (!this.$route.query.v) return

      await this.$fetch()

      await (this.$store as Store).dispatch(
        'Player/LOAD_BY_VIDEO_ID',
        this.info!.id
      )
    }
  },
  async activated() {
    console.log('[activated] info: ', this.info)
    if (!this.info || this.info.id === this.$route.query.v) return

    console.log('[continutued]')
    this.fetchPlayerQueue()

    await this.$fetch()
    await this.fetchPlayerQueue()
    console.log('after activated fetch info', this.info)
    this.$nextTick(() => {
      ;(this.$store as Store).dispatch('Player/LOAD_BY_VIDEO_ID', this.info!.id)
    })
  },
  deactivated() {
    // ;(window as any).player.destroy()
  },
  mounted() {
    console.log('%c[mounted]', 'color:red')
    this.loadYouTubeIframeAPI()

    this.fetchPlayerQueue()
  },
  methods: {
    async fetchPlayerQueue() {
      if (!this.$route.query.list) return

      await (this.$store as Store).dispatch(
        'Player/FETCH_PLAYER_QUEUE',
        this.$route.query.list as string | undefined | null
      )
    },
    loadYouTubeIframeAPI() {
      // LINK https://developers.google.com/youtube/iframe_api_reference
      const tag = document.createElement('script')
      console.log('tag: ', tag)
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag)
      ;(this.$store as Store).dispatch(
        'Player/INIT_PLAYER',
        this.$route.query.v as string
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
