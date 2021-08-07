import { MutationTree } from 'vuex/types/index'
import { State } from './state'

export enum MutationTypes {
  SET_TOKEN = 'SET_TOKEN'
}

export interface Mutations<S = State> {
  [MutationTypes.SET_TOKEN]: (state: S, payload: string) => void
}

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_TOKEN]: (state, payload) => {
    state.accessToken = payload
  }
}

export default mutations
