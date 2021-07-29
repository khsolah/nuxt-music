import { GetterTree } from 'vuex/types/index'
import { RootState, State } from './state'

export enum GetterTypes {
  GET_TOKEN = 'GET_TOKEN'
}

export interface Getters<S = State> {
  [GetterTypes.GET_TOKEN]: (state: S) => {
    accessToken: State['accessToken']
    refreshToken: State['refreshToken']
  }
}

const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.GET_TOKEN]: ({ accessToken, refreshToken }) => ({
    accessToken,
    refreshToken
  })
}

export default getters
