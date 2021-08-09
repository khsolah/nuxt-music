import { GetterTree } from 'vuex/types/index'
import { Namespaced } from '..'
import { RootState } from '../state'
import { State } from './state'

export enum GetterTypes {
  GET_PLAYER_SLOT_STYLE = 'GET_PLAYER_SLOT_STYLE',
  GET_PLAYER_STATUS = 'GET_PLAYER_STATUS',
  GET_CURRENT_VIDEO_INFO = 'GET_CURRENT_VIDEO_INFO',
  GET_PLAYER_QUEUE = 'GET_PLAYER_QUEUE',
  GET_PLAYLIST = 'GET_PLAYLIST',
  GET_VIDEOS = 'GET_VIDEOS',
  GET_PROGRESS = 'GET_PROGRESS',
  GET_CURRENT_TIME = 'GET_CURRENT_TIME',
  GET_DURATIONS = 'GET_DURATIONS'
}

export interface Getters<S = State> {
  [GetterTypes.GET_PLAYER_SLOT_STYLE]: (state: S) => State['playerSlotStyle']
  [GetterTypes.GET_PLAYER_STATUS]: (state: S) => State['playerStatus']
  [GetterTypes.GET_CURRENT_VIDEO_INFO]: (state: S) => State['currentVideoInfo']
  [GetterTypes.GET_PLAYER_QUEUE]: (state: S) => State['playerQueue']
  [GetterTypes.GET_PLAYLIST]: (state: S) => State['playlist']
  [GetterTypes.GET_VIDEOS]: (state: S) => State['videos']
  [GetterTypes.GET_PROGRESS]: (state: S) => State['progress']
  [GetterTypes.GET_CURRENT_TIME]: (
    state: S
  ) => { minutes: number; seconds: number } | undefined
  [GetterTypes.GET_DURATIONS]: (
    state: S
  ) => { time: number; timeString: string } | undefined
}

export enum PlayerGetterTypes {
  GET_PLAYER_SLOT_STYLE = 'Player/GET_PLAYER_SLOT_STYLE',
  GET_PLAYER_STATUS = 'Player/GET_PLAYER_STATUS',
  GET_CURRENT_VIDEO_INFO = 'Player/GET_CURRENT_VIDEO_INFO',
  GET_PLAYER_QUEUE = 'Player/GET_PLAYER_QUEUE',
  GET_PLAYLIST = 'Player/GET_PLAYLIST',
  GET_VIDEOS = 'Player/GET_VIDEOS',
  GET_PROGRESS = 'Player/GET_PROGRESS',
  GET_CURRENT_TIME = 'Player/GET_CURRENT_TIME',
  GET_DURATIONS = 'Player/GET_DURATIONS'
}

export interface PlayerGetters extends Namespaced<Getters, 'Player'> {}

const getters: GetterTree<State, RootState> & Getters = {
  [GetterTypes.GET_PLAYER_SLOT_STYLE]: ({ playerSlotStyle }) => playerSlotStyle,
  [GetterTypes.GET_PLAYER_STATUS]: ({ playerStatus }) => playerStatus,
  [GetterTypes.GET_CURRENT_VIDEO_INFO]: ({ currentVideoInfo }) =>
    currentVideoInfo,
  [GetterTypes.GET_PLAYER_QUEUE]: ({ playerQueue }) => playerQueue,
  [GetterTypes.GET_PLAYLIST]: ({ playlist }) => playlist,
  [GetterTypes.GET_VIDEOS]: ({ videos }) => videos,
  [GetterTypes.GET_PROGRESS]: ({ progress }) => progress,
  [GetterTypes.GET_CURRENT_TIME]: ({ currentVideoInfo }) =>
    currentVideoInfo?.time,
  [GetterTypes.GET_DURATIONS]: ({ currentVideoInfo }) =>
    currentVideoInfo?.durations
}

export default getters
