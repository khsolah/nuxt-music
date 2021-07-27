import { Plugin } from '@nuxt/types'
import { initializeCookies } from '~/utilities/$cookies'

const plugin: Plugin = ({ $cookies }: any) => {
  initializeCookies($cookies)
}

export default plugin
