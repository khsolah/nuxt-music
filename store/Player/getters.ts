import { GetterTree } from 'vuex/types/index'
import { Namespaced } from '..'
import { RootState } from '../state'
import { State } from './state'

export enum GetterTypes {
  GET_PLAYER_STATUS = 'GET_PLAYER_STATUS',
  GET_PROGRESS = 'GET_PROGRESS',
  GET_CURRENT_TIME = 'GET_CURRENT_TIME',
  GET_DURATIONS = 'GET_DURATIONS'
}

export interface Getters<S = State> {
  [GetterTypes.GET_PLAYER_STATUS]: (state: S) => State['playerStatus']
  [GetterTypes.GET_PROGRESS]: (state: S) => State['progress']
  [GetterTypes.GET_CURRENT_TIME]: (state: S) => State['currentTime']
  [GetterTypes.GET_DURATIONS]: (state: S) => State['durations']
}

export enum PlayerGetterTypes {
  GET_PLAYER_STATUS = 'Player/GET_PLAYER_STATUS',
  GET_PROGRESS = 'Player/GET_PROGRESS',
  GET_CURRENT_TIME = 'Player/GET_CURRENT_TIME',
  GET_DURATIONS = 'Player/GET_DURATIONS'
}

export interface PlayerGetters extends Namespaced<Getters, 'Player'> {}

const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.GET_PLAYER_STATUS]: ({ playerStatus }) => playerStatus,
  [GetterTypes.GET_PROGRESS]: ({ progress }) => progress,
  [GetterTypes.GET_CURRENT_TIME]: ({ currentTime }) => currentTime,
  [GetterTypes.GET_DURATIONS]: ({ durations }) => durations
}

export default getters
