<template>
  <aside
    v-if="info"
    class="
      bg-black
      flex
      w-full
      right-0
      bottom-0
      left-0
      fixed
      justify-between
      items-center
      lg:h-18
      -lg:h-16
    "
    @click="togglePlayer"
  >
    <div
      class="
        bg-black
        rounded-sm
        h-45
        transition-all
        right-12
        bottom-22
        w-80
        duration-500
        fixed
      "
      :class="{ '-lg:hidden': $route.name !== 'watch' }"
      :style="$route.name === 'watch' ? playerSlotStyle : ''"
    >
      <div id="player"></div>
    </div>
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
      @click.stop="checkoutPlayer"
    />
    <!-- left controls -->
    <div class="flex-shrink-0 inline-flex items-center justify-center">
      <div
        class="cursor-pointer h-10 ml-2 p-2 w-10"
        role="button"
        aria-label="上一首歌"
        title="上一首歌"
        @click.stop.prevent="
          checkoutPlayer()
          prevVideo()
        "
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
        @click.stop="checkoutPlayer"
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
        @click.stop="checkoutPlayer"
      >
        <Icon name="pause" class="h-full fill-white w-full" />
      </div>
      <div
        class="cursor-pointer h-10 ml-2 p-2 w-10"
        role="button"
        aria-label="下一首歌"
        title="下一首歌"
        @click.stop.prevent="
          checkoutPlayer()
          nextVideo()
        "
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
        :src="info.snippet.thumbnails.default.url"
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
          @click.stop=""
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
          @click.stop=""
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
        @click.stop="togglePlayer"
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
</template>

<script lang="ts">
import Vue from 'vue'
import { PlayListItem, VideoItem } from '~/@types'
import { Store } from '~/store'
import { PlayerActionTypes } from '~/store/Player/actions'
import { PlayerGetterTypes } from '~/store/Player/getters'
import { PlayerMutationTypes } from '~/store/Player/mutations'

export default Vue.extend({
  name: 'PlayerController',
  data() {
    return { playerStyle: {} }
  },
  fetch() {
    if (!this.$route.query.v) return

    this.setupPlayer()
  },
  computed: {
    info() {
      return (this.$store as Store).getters[
        PlayerGetterTypes.GET_CURRENT_VIDEO_INFO
      ]
    },
    currentTime() {
      return (this.$store as Store).getters[PlayerGetterTypes.GET_CURRENT_TIME]
    },
    durations() {
      return (this.$store as Store).getters[PlayerGetterTypes.GET_DURATIONS]
    },
    progress: {
      get() {
        return (this.$store as Store).getters[PlayerGetterTypes.GET_PROGRESS]
      },
      set(value: number) {
        return (this.$store as Store).dispatch(PlayerActionTypes.SEEK_TO, value)
      }
    },
    playerQueue() {
      return (this.$store as Store).getters[PlayerGetterTypes.GET_PLAYER_QUEUE]
    },
    playerStatus() {
      return (this.$store as Store).getters[PlayerGetterTypes.GET_PLAYER_STATUS]
    },
    playerSlotStyle() {
      return (this.$store as Store).getters[
        PlayerGetterTypes.GET_PLAYER_SLOT_STYLE
      ]
    }
  },
  watch: {
    async $route() {
      if (
        !this.$route.query.v ||
        (this.info !== null && this.info.id === this.$route.query.v)
      )
        return

      await this.$fetch()

      await (this.$store as Store).dispatch(
        PlayerActionTypes.LOAD_BY_VIDEO_ID,
        `${this.$route.query.v}`
      )
    }
  },
  methods: {
    togglePlayer() {
      if (this.$route.name === 'watch') {
        this.$router.go(-1)
      } else {
        this.$router.push({
          name: 'watch',
          query: {
            v: this.info!.id,
            list: this.info!.playlistId
          }
        })
      }
    },
    checkoutPlayer() {
      if ((window as any).player.loadVideoById) return
      ;(this.$store as Store).dispatch(
        PlayerActionTypes.PLAYER_INIT,
        (this.$route.query.v as string) || `${this.info?.id}`
      )
    },
    async nextVideo() {
      const { currentIndex, data, type } = this.playerQueue
      if (currentIndex + 1 > data.length) return

      const id =
        type === 'playlist'
          ? (data[currentIndex + 1] as PlayListItem).snippet.resourceId.videoId
          : (data[currentIndex + 1] as VideoItem).id
      if (this.$route.name === 'watch') {
        this.$router.push({
          name: 'watch',
          query: { v: id, list: this.$route.query.list }
        })
      } else {
        await (this.$store as Store).dispatch(
          PlayerActionTypes.LOAD_BY_VIDEO_ID,
          id
        )
        this.setupPlayer()
      }
    },
    async prevVideo() {
      const { currentIndex, data, type } = this.playerQueue
      if (currentIndex - 1 < 0) return

      const id =
        type === 'playlist'
          ? (data[currentIndex - 1] as PlayListItem).snippet.resourceId.videoId
          : (data[currentIndex - 1] as VideoItem).id
      if (this.$route.name === 'watch')
        this.$router.push({
          name: 'watch',
          query: { v: id, list: this.$route.query.list }
        })
      else {
        await (this.$store as Store).dispatch(
          PlayerActionTypes.LOAD_BY_VIDEO_ID,
          data[currentIndex - 1].id
        )
        this.setupPlayer()
      }
    },
    async setupPlayer() {
      await (this.$store as Store).dispatch(
        PlayerActionTypes.FETCH_VIDEO_INFO,
        {
          v: this.$route.query.v as string,
          playlistId: this.$route.query.list as string | null | undefined
        }
      )
      ;(this.$store as Store).commit(
        PlayerMutationTypes.SET_DURATIONS,
        this.info!.contentDetails.duration
      )
      ;(this.$store as Store).commit(PlayerMutationTypes.SET_PROGRESS, 0)
    }
  }
})
</script>

<style lang="css" scoped>
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
