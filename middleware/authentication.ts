import { Middleware } from '@nuxt/types'
import { Store } from '~/store'

const middleware: Middleware = ({ redirect, route, store }) => {
  const accessToken = (store as Store).getters.GET_TOKEN.accessToken
  if (accessToken) return

  route.meta?.forEach((meta: { Authentication?: boolean }) => {
    if (meta.Authentication) redirect('/?auth=true')
  })
}

export default middleware
