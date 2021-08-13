import { Context } from '@nuxt/types'
import { ActionContext, ActionTree, DispatchOptions } from 'vuex/types/index'
import { Mutations, MutationTypes } from './mutations'
import { RootState, State } from './state'
import { $axios } from '~/utilities/$axios'

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
    payload: { $cookies: Context['app']['$cookies'] }
  ) => void
}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.NUXT_SERVER_INIT]: async ({ commit }, { $cookies }) => {
    await $axios({
      baseURL: process.env.REFERER,
      url: '/auth/refresh',
      method: 'GET'
    })
      .then(({ data: { token } }) => {
        commit(MutationTypes.SET_TOKEN, token)
        $cookies.set('accessToken', token, {
          expires: new Date(Date.now() + 3500 * 1000)
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
}

export default actions
