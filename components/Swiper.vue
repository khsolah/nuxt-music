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
          v-for="item in 10"
          :key="item"
          class="
            cursor-pointer
            flex-col
            h-full
            flex-shrink-0
            mr-4
            w-40
            inline-flex
            justify-center
            lg:w-45
            xl:w-190px
            3xl:w-226px
            xl:mr-6
          "
        >
          <nuxt-link
            :to="{ name: 'index' }"
            class="
              bg-white
              rounded-3px
              pb-40
              w-40
              lg:w-45 lg:pb-45
              xl:w-190px xl:pb-190px
              select-none
              3xl:w-226px
            "
          />
          <div class="mt-4">
            <div
              class="
                font-medium
                text-sm text-white
                w-full
                overflow-ellipsis
                line-clamp-2
              "
            >
              Different
            </div>
            <span
              class="
                flex flex-wrap
                mt-3px
                text-xs text-white text-opacity-70
                line-clamp-2
              "
              ><span>Maggie</span><span> &nbsp;&bull;&nbsp; </span
              ><span>觀看次數：62萬次</span></span
            >
          </div>
        </li>
      </slot>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue'

export default Vue.extend({
  name: 'Swiper',
  props: {
    slidePerView: {
      type: Number,
      default: 1
    } as PropOptions<number>,
    data: {
      type: Array
    } as PropOptions<{ id: string; player: string }[]>
  },
  data() {
    return {
      index: 0,
      translateX: 0,
      maxTranslateX: 0,
      startX: 0,
      slideWidth: 0,
      sliding: false
    }
  },
  mounted() {
    const slideStyle = getComputedStyle(
      (this.$refs.wrapper as Element).firstElementChild as HTMLDivElement
    )
    const slideGap = +slideStyle.marginRight.replace('px', '')
    this.slideWidth = +slideStyle.width.replace('px', '') + slideGap
    this.maxTranslateX =
      +getComputedStyle(this.$refs.wrapper as Element).width.replace('px', '') -
      +getComputedStyle(this.$refs.swiper as Element).width.replace('px', '') -
      slideGap
  },
  methods: {
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
    }
  }
})
</script>
