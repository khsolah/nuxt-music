<template>
  <main class="text-white pt-16">
    <section class="section">
      <h1 class="title">熱門歌曲</h1>
      <Swiper class="lg:mt-4 lg:mb-6" :data="hot" />
    </section>

    <section class="section">
      <h2 class="title">
        <div class="font-normal text-[#aaa] text-sm mb-0.5">為你推薦</div>
        <span>IU</span>
      </h2>
      <Swiper class="lg:mb-6" :data="iu" singer="IU" />
    </section>

    <section class="section">
      <h2 class="title">
        <div class="font-normal text-[#aaa] text-sm mb-0.5">為你推薦</div>
        <span>Taeyeon</span>
      </h2>
      <Swiper class="lg:mb-6" :data="taeyeon" singer="IU" />
    </section>
  </main>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { HotVideoItem, PlayListItem } from '@/@types'
import qs from 'qs'
import Vue from 'vue'
import { Store } from '~/store'

export default Vue.extend({
  middleware({ route, redirect, store, $axios }) {
    // check access_token and refresh_token exist in route.query
    // if true, remove token data
    if (
      typeof route.query.access_token === 'string' &&
      typeof route.query.refresh_token
    ) {
      console.log('access_token', route.query.access_token)
      console.log('refresh_token', route.query.refresh_token)
      redirect(route.path)
    }

    if ((store as Store).getters.GET_TOKEN.accessToken) {
      $axios.setHeader(
        'Authorization',
        `Bearer ${(store as Store).getters.GET_TOKEN.accessToken}`
      )
    }
  },
  data() {
    return {
      hot: [] as HotVideoItem[],
      iu: [] as PlayListItem[],
      taeyeon: [] as PlayListItem[]
    }
  },
  async fetch() {
    this.hot = await this.getUSHotMusic()
    this.iu = await this.getIUMusic()
    this.taeyeon = await this.getTaeyeonMusic()
  },
  computed: {
    accessToken(): string | null {
      return (this.$store as Store).getters.GET_TOKEN.accessToken
    }
  },
  methods: {
    getUSHotMusic(): Promise<HotVideoItem[]> {
      return this.$axios({
        url: `/youtube/v3/videos?${qs.stringify({
          part: 'contentDetails,id,player,snippet,status,statistics',
          chart: 'mostPopular',
          maxResults: 10,
          videoCategoryId: '10'
        })}`,
        method: 'GET'
      })
        .then((response: AxiosResponse<{ items: HotVideoItem[] }>) => {
          return response.data.items
        })
        .catch(error => {
          console.log('[error]: ', error)
          console.log('[error response]: ', error.response.data)

          return require('@/data/hot/kr.json').items
        })
    },
    getIUMusic(): Promise<PlayListItem[]> {
      return this.$axios({
        url: `https://youtube.googleapis.com/youtube/v3/playlistItems?${qs.stringify(
          {
            part: 'contentDetails,id,snippet,status',
            maxResults: 10,
            playlistId: 'PLu1kdfBqycPMziOwQc6-x2OOLaUqIlwGL'
          }
        )}`,
        method: 'GET'
      })
        .then((response: AxiosResponse<{ items: PlayListItem[] }>) => {
          console.log('[iu]', response)
          return response.data.items
        })
        .catch(error => {
          console.log('[error]: ', error)
          console.log('[error response]: ', error.response)

          return require('@/data/playlist/iu.json').items
        })
    },
    getTaeyeonMusic(): Promise<PlayListItem[]> {
      return this.$axios({
        url: `https://youtube.googleapis.com/youtube/v3/playlistItems?${qs.stringify(
          {
            part: 'contentDetails,id,snippet,status',
            maxResults: 10,
            playlistId: 'PLu1kdfBqycPMziOwQc6-x2OOLaUqIlwGL'
          }
        )}`,
        method: 'GET'
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: PlayListItem[] }>) =>
            items
        )
        .catch(error => {
          console.log('[error]: ', error)
          console.log('[error response]: ', error.response)

          return require('@/data/playlist/taeyeon.json').items
        })
    }
  }
})
</script>

<style lang="postcss" scoped>
.section {
  @apply mx-auto
    -lg:mx-4
    lg:w-[89vw] lg:mb-6
    xl:w-[1050px] xl:mb-12
    2xl:w-316
    3xl:w-[1478px];
}

.title {
  @apply font-bold text-white leading-snug py-4 text-2xl
    xl:pb-4 xl:pt-8
    3xl:pb-6;
}
</style>
