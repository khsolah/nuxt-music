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
    <section class="lg:mx-auto lg:w-180 -lg:mx-22px -lg:w-auto xl:w-215">
      <h2 class="font-bold my-4 text-base text-white">熱門搜尋結果</h2>
      <ul class="list-none pl-0">
        <li
          v-for="item in result"
          :key="item.etag"
          class="
            flex
            items-center
            border-solid border-white border-0 border-b-1 border-opacity-10
            h-20
          "
        >
          <nuxt-link
            :to="{ name: 'watch', query: { v: item.id.videoId } }"
            class="flex no-underline items-center"
          >
            <img
              :src="item.snippet.thumbnails.default.url"
              alt=""
              class="h-14 mr-4 w-14"
            />
            <div class="flex flex-col">
              <span
                class="
                  font-medium
                  text-white text-sm
                  leading-snug
                  line-clamp-1
                  -lg:mb-1 -lg:leading-18px
                  2xl:text-base
                "
                >{{ item.snippet.title }}</span
              >
              <span
                class="
                  font-normal
                  text-white text-sm text-opacity-70
                  line-clamp-1
                  -lg:leading-18px
                  2xl:text-base
                "
                >{{ item.snippet.channelTitle }}</span
              >
            </div>
          </nuxt-link>
        </li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import qs from 'qs'
import Vue from 'vue'
import { SearchResult } from '~/@types'

export default Vue.extend({
  name: 'Search',
  beforeRouteUpdate({ name, query: { q } }, _, next) {
    if (name !== 'search') return next()

    this.fetchSearchData(typeof q === 'string' ? q : undefined)
    next()
  },
  data() {
    return {
      result: [] as SearchResult[]
    }
  },
  async fetch() {
    await this.fetchSearchData()
  },
  methods: {
    fetchSearchData(q?: string): Promise<void> {
      return this.$axios({
        url: `/youtube/v3/search?${qs.stringify({
          part: 'snippet',
          maxResults: 25,
          type: 'video',
          videoCategoryId: 10,
          q: q || this.$route.query.q
        })}`
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: SearchResult[] }>) => {
            this.result = items
          }
        )
        .catch(() => {
          this.result = []
        })
    }
  }
})
</script>
