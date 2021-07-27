import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utilities/$axios'

const plugin: Plugin = ({ $axios }) => {
  $axios.setBaseURL('https://api.spotify.com')
  initializeAxios($axios)
}

export default plugin
