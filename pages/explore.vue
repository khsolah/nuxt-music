<template>
  <main class="text-white pt-16 pb-28 lg:px-14 -lg:px-4 2xl:px-17">
    <h2
      class="font-bold my-4 text-2xl xl:text-28px 2xl:text-34px 3xl:text-45px"
    >
      好心情
    </h2>
    <section class="mb-14">
      <h3 class="font-bold text-xl mb-6 xl:text-2xl">精選內容</h3>
      <ul
        class="
          list-none
          grid
          pl-0
          gap-4
          grid-cols-4
          -md:grid-cols-2
          xl:grid-cols-5
          2xl:grid-cols-6
        "
      >
        <li v-for="item in featured" :key="item.etag">
          <nuxt-link
            :to="{
              name: 'watch',
              query: { list: item.id }
            }"
            class="text-white w-full no-underline"
          >
            <div
              v-lazy="getThumbnail(item.snippet.thumbnails)"
              class="rounded-md w-full"
              style="padding-bottom: 100%; background-size: 100%"
            />

            <div class="mt-2">
              <span
                class="
                  font-medium
                  mt-2
                  text-sm
                  leading-snug
                  line-clamp-2
                  2xl:text-base
                "
                >{{ item.snippet.title }}</span
              >
              <!-- <span
                class="font-normal text-sm leading-snug text-opacity-70 line-clamp-2 2xl:text-base"
                >{{ item.snippet.description }}</span
              > -->
            </div>
          </nuxt-link>
        </li>
      </ul>
    </section>
    <section>
      <h3 class="font-bold text-xl mb-6 xl:text-2xl">精選播放清單</h3>

      <ul
        class="
          list-none
          grid
          pl-0
          gap-4
          grid-cols-4
          -md:grid-cols-2
          xl:grid-cols-5
          2xl:grid-cols-6
        "
      >
        <li v-for="item in random" :key="item.etag">
          <nuxt-link
            :to="{
              name: 'watch',
              query: { list: item.id }
            }"
            class="text-white w-full no-underline"
          >
            <div
              v-lazy="getThumbnail(item.snippet.thumbnails)"
              class="rounded-md w-full"
              style="padding-bottom: 100%; background-size: 100%"
            />

            <div class="mt-2">
              <span
                class="
                  font-medium
                  mt-2
                  text-sm
                  leading-snug
                  line-clamp-2
                  2xl:text-base
                "
                >{{ item.snippet.title }}</span
              >
              <!-- <span
                class="font-normal text-sm leading-snug text-opacity-70 line-clamp-2 2xl:text-base"
                >{{ item.snippet.description }}</span
              > -->
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
import { PlayList, PlayListItem, Thumbnails } from '~/@types'
import { getThumbnail } from '~/utilities'

export default Vue.extend({
  name: 'Explore',
  async beforeRouteLeave({ name, query: { list, v } }, _, next) {
    if (name !== 'watch' || (name === 'watch' && v)) return next()
    console.log('[else]')
    console.log('name: ', name)
    console.log('list: ', list)
    console.log('v:', v)

    const videoId = await this.getVideoId(`${list}`)
    next({ name: `${name}`, query: { list, v: videoId } })
  },
  data() {
    return {
      featured: [] as PlayList[],
      random: [] as PlayList[]
    }
  },
  async fetch() {
    await this.getFeaturedData()
    await this.getRandom()
  },
  methods: {
    getFeaturedData() {
      this.$axios({
        url: `/youtube/v3/playlists?${qs.stringify({
          part: 'id,snippet',
          id: 'RDCLAK5uy_kLln07XrECeVyVlW7spgRowuvWj-syBws,RDCLAK5uy_m0wlRoNn5iCTTgBedfoOQ19Jq9P3XTLIA'
        })}`
      })
        .then(({ data: { items } }: AxiosResponse<{ items: PlayList[] }>) => {
          this.featured = items
        })
        .catch(() => {
          this.featured = []
        })
    },
    getRandom() {
      return this.$axios({
        url: `/youtube/v3/playlists?${qs.stringify({
          part: 'id,snippet',
          id: 'RDCLAK5uy_nEOENcLJBr5ZWcX5KsRFqlkLp05vN23Yk,RDCLAK5uy_kT-sIJz2O-hpkxwjosN2hMt9Y5xevcPYI,RDCLAK5uy_ldLj_raotpFCQGWiQ7L-Ag5GTbGOyjgRY,RDCLAK5uy_nDL8KeBrUagwyISwNmyEiSfYgz1gVCesg,RDCLAK5uy_nZJzoZEBYRptA2XXskbxGTvKkevapT_F4,RDCLAK5uy_l7K78k4EkjcFojhd1617rmUjY-aet6-t0,RDCLAK5uy_k-4bBZpMA00LtvrMiVcRNr0caz135-Ydw,RDCLAK5uy_lGgGDpsoD65Xo1oFFcD7Qy7OWI0j3k-GM,RDCLAK5uy_lNvwIE3Qra5IBQSBBG460nLyxbwnzjDRU,RDCLAK5uy_kZrl2zRAhgWqfFySFdMDOpwF5STSwNFRE'
        })}`
      })
        .then(({ data: { items } }: AxiosResponse<{ items: PlayList[] }>) => {
          this.random = items
        })
        .catch(() => {
          this.random = []
        })
    },
    getVideoId(playlistId: string) {
      return this.$axios({
        url: `/youtube/v3/playlistItems?${qs.stringify({
          part: 'snippet',
          playlistId,
          maxResults: 1
        })}`,
        method: 'GET'
      })
        .then(
          ({ data: { items } }: AxiosResponse<{ items: PlayListItem[] }>) =>
            items[0].snippet.resourceId.videoId
        )
        .catch(() => '')
    },
    getThumbnail(thumbnails: Thumbnails): string {
      return getThumbnail(thumbnails)
    }
  }
})
</script>
