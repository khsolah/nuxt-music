<template>
  <main class="text-white pt-16">
    <section class="section">
      <h1 class="title">熱門歌曲</h1>
      <Swiper class="lg:mt-4 lg:mb-6" :data="hot" />
    </section>

    <section v-if="myPlayList" class="section">
      <h2 class="title">我的收藏</h2>
      <Swiper class="lg:mb-6" :data="myPlayList" type="playlist" />
    </section>

    <section class="section">
      <h2 class="title">
        <div class="font-normal text-[#aaa] text-sm mb-0.5">為你推薦</div>
        <span>IU</span>
      </h2>
      <Swiper class="lg:mb-6" :data="iu" type="playlist" />
    </section>

    <section class="section">
      <h2 class="title">
        <div class="font-normal text-[#aaa] text-sm mb-0.5">為你推薦</div>
        <span>Taeyeon</span>
      </h2>
      <Swiper class="lg:mb-6" :data="taeyeon" type="playlist" />
    </section>
  </main>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios'
import { PlayList, PlayListItem, VideoItem } from '@/@types'
import qs from 'qs'
import Vue from 'vue'
import { Store } from '~/store'

export default Vue.extend({
  data() {
    return {
      hot: [] as VideoItem[],
      iu: [] as PlayListItem[],
      taeyeon: [] as PlayListItem[],
      myPlayList: null as null | PlayList[]
    }
  },
  async fetch() {
    this.hot = await this.getUSHotMusic()
    this.iu = await this.getIUMusic()
    this.taeyeon = await this.getTaeyeonMusic()
    this.myPlayList = await this.getMyPlayList()
  },
  computed: {
    accessToken(): string | null {
      return (this.$store as Store).getters.GET_TOKEN
    }
  },
  methods: {
    getUSHotMusic(): Promise<VideoItem[]> {
      return this.$axios({
        url: `/youtube/v3/videos?${qs.stringify({
          part: 'id,snippet',
          chart: 'mostPopular',
          maxResults: 10,
          videoCategoryId: '10'
        })}`,
        method: 'GET'
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: VideoItem[] }>) => items
        )
        .catch(error => {
          console.log('[error]: ', error)
          console.log('[error response]: ', error.response.data)

          return require('@/data/hot/kr.json').items
        })
    },
    getMyPlayList(): Promise<PlayList[] | null> {
      return this.$axios({
        url: `/youtube/v3/playlists?${qs.stringify({
          part: 'contentDetails,id,snippet',
          maxResults: 10,
          mine: true
        })}`,
        method: 'GET'
      })
        .then(({ data: { items } }: AxiosResponse<{ items: PlayList[] }>) => {
          console.log('[get playlist]: ', items)
          return items
        })
        .catch(error => {
          console.log('[getMyPlayList]:[error]: ', error)
          console.log('[getMyPlayList]:[error response]: ', error.response)

          return null
        })
    },
    getIUMusic(): Promise<PlayListItem[]> {
      return this.$axios({
        url: `/youtube/v3/playlistItems?${qs.stringify({
          part: 'contentDetails,id,snippet',
          maxResults: 10,
          playlistId: 'PLu1kdfBqycPMziOwQc6-x2OOLaUqIlwGL'
        })}`,
        method: 'GET'
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: PlayListItem[] }>) =>
            items
        )
        .catch(error => {
          console.log('[error]: ', error)
          console.log('[error response]: ', error.response)

          return require('@/data/playlist/iu.json').items
        })
    },
    getTaeyeonMusic(): Promise<PlayListItem[]> {
      return this.$axios({
        url: `/youtube/v3/playlistItems?${qs.stringify({
          part: 'id,snippet',
          maxResults: 10,
          playlistId: 'RDEMy8pkziu8aVgRBptlSwxoig'
        })}`,
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
