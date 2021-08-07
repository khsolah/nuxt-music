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
        overflow-scroll
        lg:ml-12
        xl:ml-14
        3xl:ml-16
      "
    >
      <ul v-if="$route.query.list" class="list-none pl-0">
        <li
          v-for="item in playlist"
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
          v-for="item in videos"
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
        @change="seekTo"
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
          {{ convertTimeString(currentTime) }}&nbsp;/&nbsp;{{
            durations.timeString
          }}
        </span>
      </div>

      <!-- middle controls -->
      <div class="inline-flex items-center justify-center">
        <img
          class="h-10 w-auto -lg:hidden"
          :src="`https://i.ytimg.com/vi/${$route.query.v}/default.jpg`"
          alt=""
        />

        <div class="flex flex-col flex-shrink-0 mr-2 text-white ml-4">
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
          class="h-10 p-2 w-10"
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
import { AxiosResponse } from 'axios'
import qs from 'qs'
import Vue from 'vue'
import { PlayListItem, VideoItem } from '~/@types'
import convertDurations from '~/utilities/convertDurations'

export default Vue.extend({
  name: 'Watch',
  meta: {
    Authentication: true
  },
  data() {
    return {
      info: null as null | VideoItem,
      playlist: [] as PlayListItem[],
      videos: [] as VideoItem[],
      player: null as null | {
        playerInfo: { currentTime: number }
        seekTo: Function
      },
      durations: {
        time: 0,
        timeString: ''
      },
      currentTime: {
        minutes: 0,
        seconds: 0,
        time: 0
      },
      progress: 0,
      playerStatus: 'play' as 'play' | 'pause'
    }
  },
  async fetch() {
    this.info = await this.getInfo()
    const durations = convertDurations(this.info!.contentDetails.duration || '')
    this.durations.time = durations.time
    this.durations.timeString = this.convertTimeString(durations)

    this.$route.query.list && this.playlist.length === 0
      ? (this.playlist = this.playlist.concat(await this.getPlayListItems()))
      : (this.videos = await this.getVideos())
  },
  mounted() {
    // LINK https://developers.google.com/youtube/iframe_api_reference
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScript = document.getElementsByTagName(
      'script'
    )[0] as HTMLScriptElement
    firstScript.parentNode!.insertBefore(tag, firstScript)
    ;(window as any).onYouTubeIframeAPIReady = () => {
      console.log('success')
      this.player = new (window as any).YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: this.$route.query.v,
        events: {
          onReady: ({
            target
          }: {
            target: { playVideo: Function; pauseVideo: Function }
          }) => {
            target.playVideo()
            ;(this.$refs.play as HTMLDivElement).addEventListener(
              'click',
              () => {
                this.playerStatus = 'play'
                target.playVideo()
              }
            )
            ;(this.$refs.pause as HTMLDivElement).addEventListener(
              'click',
              () => {
                this.playerStatus = 'pause'
                target.pauseVideo()
              }
            )
          },
          onStateChange: (event: { data: number }) => {
            this.currentTime = this.convertCurrentTime(
              this.player!.playerInfo.currentTime
            )
            this.progress = this.currentTime.time

            const data = event.data
            if (data === (window as any).YT.PlayerState.PLAYING) {
              this.playerStatus = 'play'
              ;(window as any).progress = setInterval(() => {
                this.progress++
                this.currentTime = this.convertCurrentTime(this.progress)
              }, 1000)
            } else {
              this.playerStatus = 'pause'
              clearInterval((window as any).progress)
            }
          }
        }
      })
    }
  },
  methods: {
    getInfo(): Promise<null | VideoItem> {
      return this.$axios({
        url: `/youtube/v3/videos?${qs.stringify({
          part: 'snippet,contentDetails,statistics',
          id: this.$route.query.v,
          videoCategoryId: 10
        })}`,
        method: 'GET'
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: VideoItem[] }>) =>
            items[0]
        )
        .catch(error => {
          console.log('[info error]: ', error)
          return null
        })
    },
    getVideos(): Promise<VideoItem[]> {
      return this.$axios({
        url: `/youtube/v3/videos?${qs.stringify({
          part: 'id,snippet,contentDetails,statistics',
          chart: 'mostPopular',
          regionCode: 'KR',
          videoCategoryId: 10,
          maxResults: 15
        })}`,
        method: 'GET'
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: VideoItem[] }>) => items
        )
        .catch(error => {
          console.log('[get videos error]: ', error)
          console.log('[error response]: ', error.response)
          return []
        })
    },
    getPlayListItems(): Promise<PlayListItem[]> {
      return this.$axios({
        url: `/youtube/v3/playlistItems?${qs.stringify({
          part: 'id,snippet',
          playlistId: this.$route.query.list,
          maxResults: 15
        })}`
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: PlayListItem[] }>) => {
            console.log(items)
            return items
          }
        )
        .catch(error => {
          console.log('[error]: ', error)
          console.log('[error.response]', error.response)
          return []
        })
    },
    convertCurrentTime(time: number) {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)

      return {
        minutes,
        seconds,
        time: minutes * 60 + seconds
      }
    },
    convertTimeString({
      minutes,
      seconds
    }: {
      minutes: number
      seconds: number
    }) {
      return `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`
    },
    seekTo() {
      if (!this.player) return
      this.player.seekTo(this.progress)
      this.currentTime = this.convertCurrentTime(this.progress)
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
