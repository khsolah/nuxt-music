<template>
  <!-- swiper container -->
  <div ref="swiper" class="overflow-hidden">
    <!-- swiper wrapper -->
    <ul
      ref="wrapper"
      class="flex-nowrap h-full list-none transform pl-0 inline-flex"
      :class="{ 'transition-transform duration-300': !sliding }"
      @mousedown.stop.prevent="slideInit"
    >
      <!-- swiper slides -->
      <slot name="default">
        <li
          v-for="item in data"
          :key="item.etag"
          class="
            cursor-pointer
            flex-col
            h-full
            flex-shrink-0
            mr-4
            w-40
            relative
            inline-flex
            justify-center
            lg:w-45
            xl:w-190px
            3xl:w-226px
            xl:mr-6
          "
        >
          <nuxt-link
            v-lazy="item.snippet.thumbnails.high.url"
            :to="{
              name: 'watch',
              query: {
                v:
                  type !== 'playlist'
                    ? item.id
                    : item.snippet.resourceId.videoId,
                list: type !== 'playlist' ? undefined : item.snippet.playlistId
              }
            }"
            class="
              bg-white
              rounded-3px
              pb-40
              w-40
              relative
              thumbnail
              select-none
              lg:w-45 lg:pb-45
              xl:w-190px xl:pb-190px
              3xl:w-226px
            "
          >
            <Icon
              name="play"
              class="
                h-12
                fill-white
                transform
                top-1/2
                left-1/2
                w-12
                -translate-x-1/2 -translate-y-1/2
                absolute
              "
            />
          </nuxt-link>
          <div class="mt-4">
            <div
              v-if="item.snippet"
              class="
                font-medium
                text-sm text-white
                w-full
                overflow-ellipsis
                line-clamp-2
              "
            >
              {{ item.snippet.title }}
            </div>
            <span
              v-if="item.snippet"
              class="
                flex flex-wrap
                mt-3px
                text-xs text-white text-opacity-70
                line-clamp-2
              "
            >
              <template v-if="item.statistics">
                <span>{{ item.snippet.title }}</span
                ><span> &nbsp;&bull;&nbsp; </span
                ><span
                  >觀看次數：{{
                    transformCount(item.statistics.viewCount)
                  }}</span
                >
              </template>
              <span v-if="item.snippet.videoOwnerChannelTitle">{{
                item.snippet.videoOwnerChannelTitle
              }}</span>
            </span>
          </div>
        </li>
      </slot>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'
import { VideoItem, PlayListItem } from '~/@types'

export default Vue.extend({
  name: 'Swiper',
  props: {
    slidePerView: {
      type: Number,
      default: 1
    } as PropOptions<number>,
    data: {
      type: Array
    } as PropOptions<VideoItem[] | PlayListItem[]>,
    type: {
      type: String,
      default: 'video'
    }
  },
  data() {
    return {
      index: 0,
      translateX: 0,
      maxTranslateX: 0,
      startX: 0,
      slideWidth: 0,
      sliding: false,
      alreadyInitialized: false
    }
  },
  watch: {
    data() {
      if (this.data.length > 0 && !this.alreadyInitialized)
        this.$nextTick(() => this.initialize())
    }
  },
  methods: {
    initialize() {
      this.alreadyInitialized = true
      const slideStyle = getComputedStyle(
        (this.$refs.wrapper as Element).firstElementChild as HTMLDivElement
      )
      const slideGap = +slideStyle.marginRight.replace('px', '')
      this.slideWidth = +slideStyle.width.replace('px', '') + slideGap
      this.maxTranslateX =
        +getComputedStyle(this.$refs.wrapper as Element).width.replace(
          'px',
          ''
        ) -
        +getComputedStyle(this.$refs.swiper as Element).width.replace(
          'px',
          ''
        ) -
        slideGap
    },
    slideInit(event: MouseEvent) {
      this.startX = event.clientX
      this.translateX = -this.index * this.slideWidth
      this.sliding = true

      document.addEventListener('mousemove', this.slideStart)
      document.addEventListener('mouseup', this.slideEnd)
    },
    slideStart(event: MouseEvent) {
      this.translateX -= this.startX - event.clientX
      this.translateX =
        this.translateX > 0
          ? 0
          : this.translateX < -this.maxTranslateX
          ? -this.maxTranslateX
          : this.translateX
      ;(this.$refs.wrapper as Element).setAttribute(
        'style',
        `transform: translateX(${this.translateX}px)`
      )

      this.startX = event.clientX
    },
    slideEnd() {
      this.sliding = false

      const index = +(-this.translateX / this.slideWidth).toFixed(0)
      this.index = index <= 0 ? 0 : index
      ;(this.$refs.wrapper as Element).setAttribute(
        'style',
        `transform: translateX(${-this.index * this.slideWidth}px)`
      )

      document.removeEventListener('mousemove', this.slideStart)
      document.removeEventListener('mouseup', this.slideEnd)
    },
    transformCount(count: string): string {
      if (count.length <= 4) return count
      if (count.length <= 8) return `${(+count / 10000).toFixed(0)}萬`
      else return `${(+count / 100000000).toFixed(0)}億`
    }
  }
})
</script>

<style lang="postcss" scoped>
.thumbnail::before {
  @apply content absolute top-0 left-0 right-0 bottom-0 bg-transparent;
}

.thumbnail:hover::before {
  @apply bg-black bg-opacity-[0.4];
}
</style>
