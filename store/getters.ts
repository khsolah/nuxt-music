import { GetterTree } from 'vuex/types/index'
import { RootState, State } from './state'

export enum GetterTypes {
  GET_TOKEN = 'GET_TOKEN'
}

export interface Getters<S = State> {
  [GetterTypes.GET_TOKEN]: (state: S) => State['accessToken']
}

const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.GET_TOKEN]: ({ accessToken }) => accessToken
}

export default getters
