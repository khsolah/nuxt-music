import { Context } from '@nuxt/types'
import { ActionContext, ActionTree, DispatchOptions } from 'vuex/types/index'
import { Mutations, MutationTypes } from './mutations'
import { RootState, State } from './state'

interface AugmentedContext
  extends Omit<ActionContext<State, RootState>, 'commit'> {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: DispatchOptions
  ): ReturnType<Mutations[K]>
}

export enum ActionTypes {
  NUXT_SERVER_INIT = 'nuxtServerInit'
}

export interface Actions {
  [ActionTypes.NUXT_SERVER_INIT]: (
    { commit }: AugmentedContext,
    payload: { query: Context['query']; $cookies: Context['app']['$cookies'] }
  ) => void
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.NUXT_SERVER_INIT]: ({ commit }, { query, $cookies }) => {
    if (typeof query.access_token === 'string') {
      // find code on route.query
      // store this code in both cookies and vuex
      $cookies.set('accessToken', query.access_token, {
        expires: new Date(Date.now() + +query.expires_in * 1000)
      })
      $cookies.set('refreshToken', query.refresh_token, {
        expires: new Date(Date.now() + +query.expires_in * 1000)
      })
      commit(MutationTypes.SET_TOKEN, query.access_token)
    } else if ($cookies.get('accessToken') && $cookies.get('refreshToken')) {
      // find token data in cookies,
      // store this token into vuex
      commit(MutationTypes.SET_TOKEN, $cookies.get('accessToken'))
    }
  }
}

export default actions
