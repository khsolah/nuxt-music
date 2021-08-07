import { Plugin } from '@nuxt/types'
import { Store } from '~/store'
import { initializeAxios } from '~/utilities/$axios'

const plugin: Plugin = ({ $axios, store }) => {
  $axios.setBaseURL('https://www.googleapis.com')

  $axios.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${
      (store as Store).getters.GET_TOKEN.accessToken
    }`

    console.log(config.headers)

    return config
  })

  initializeAxios($axios)
}

export default plugin
