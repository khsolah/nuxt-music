import { MutationTree } from 'vuex/types/index'
import { Namespaced } from '..'
import { State } from './state'
import { convertISO8601Durations } from '~/utilities'
import { Player, PlayListItem, VideoItem } from '~/@types'

export enum MutationTypes {
  SET_PLAYER_SLOT_STYLE = 'SET_PLAYER_SLOT_STYLE',
  SET_PLAYER_STATUS = 'SET_PLAYER_STATUS',
  SET_CURRENT_VIDEO_INFO = 'SET_CURRENT_VIDEO_INFO',
  SET_CURRENT_QUEUE = 'SET_CURRENT_QUEUE',
  SET_PLAYLIST = 'SET_PLAYLIST',
  SET_VIDEOS = 'SET_VIDEOS',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_PROGRESS = 'SET_PROGRESS',
  SET_INTERVAL = 'SET_INTERVAL',
  CLEAR_INTERVAL = 'CLEAR_INTERVAL',
  SET_DURATIONS = 'SET_DURATIONS',
  LOAD_BY_VIDEO_ID = 'LOAD_BY_VIDEO_ID'
}

export interface Mutations<S = State> {
  [MutationTypes.SET_PLAYER_SLOT_STYLE]: (
    state: S,
    payload: HTMLElement
  ) => void
  [MutationTypes.SET_PLAYER_STATUS]: (
    state: S,
    payload: State['playerStatus']
  ) => void
  [MutationTypes.SET_CURRENT_VIDEO_INFO]: (
    state: S,
    payload: State['currentVideoInfo']
  ) => void
  [MutationTypes.SET_CURRENT_QUEUE]: (
    state: S,
    payload: State['playerQueue']
  ) => void
  [MutationTypes.SET_PLAYLIST]: (state: S, payload: PlayListItem[]) => void
  [MutationTypes.SET_VIDEOS]: (state: S, payload: VideoItem[]) => void
  [MutationTypes.SET_CURRENT_TIME]: (
    state: S,
    payload: { minutes: number; seconds: number }
  ) => void
  [MutationTypes.SET_PROGRESS]: (state: S, payload: number) => void
  [MutationTypes.SET_INTERVAL]: (state: S, payload: NodeJS.Timer) => void
  [MutationTypes.CLEAR_INTERVAL]: (state: S) => void
  [MutationTypes.SET_DURATIONS]: (state: S, payload: string) => void
  [MutationTypes.LOAD_BY_VIDEO_ID]: (state: S, payload: string) => void
}

export enum PlayerMutationTypes {
  SET_PLAYER_SLOT_STYLE = 'Player/SET_PLAYER_SLOT_STYLE',
  SET_PLAYER_STATUS = 'Player/SET_PLAYER_STATUS',
  SET_CURRENT_VIDEO_INFO = 'Player/SET_CURRENT_VIDEO_INFO',
  SET_CURRENT_QUEUE = 'Player/SET_CURRENT_QUEUE',
  SET_PLAYLIST = 'Player/SET_PLAYLIST',
  SET_VIDEOS = 'Player/SET_VIDEOS',
  SET_CURRENT_TIME = 'Player/SET_CURRENT_TIME',
  SET_PROGRESS = 'Player/SET_PROGRESS',
  SET_INTERVAL = 'Player/SET_INTERVAL',
  CLEAR_INTERVAL = 'Player/CLEAR_INTERVAL',
  SET_DURATIONS = 'Player/SET_DURATIONS',
  LOAD_BY_VIDEO_ID = 'LOAD_BY_VIDEO_ID'
}

export interface PlayerMutations extends Namespaced<Mutations, 'Player'> {}

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PLAYER_SLOT_STYLE]: (state, payload) => {
    const rect = payload.getBoundingClientRect()
    state.playerSlotStyle = {
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      right: `${rect.right}px`,
      bottom: `${rect.bottom}px`
    }
  },
  [MutationTypes.SET_PLAYER_STATUS]: (state, payload) => {
    state.playerStatus = payload
  },
  [MutationTypes.SET_CURRENT_VIDEO_INFO]: (state, payload) => {
    state.currentVideoInfo = payload
  },
  [MutationTypes.SET_CURRENT_QUEUE]: (state, payload) => {
    state.playerQueue = payload
  },
  [MutationTypes.SET_PLAYLIST]: (state, payload) => {
    state.playlist = payload
  },
  [MutationTypes.SET_VIDEOS]: (state, payload) => {
    state.videos = payload
  },
  [MutationTypes.SET_CURRENT_TIME]: (state, payload) => {
    if (!state.currentVideoInfo) return

    state.currentVideoInfo.time = payload
  },
  [MutationTypes.SET_PROGRESS]: (state, payload) => {
    state.progress = payload
  },
  [MutationTypes.SET_INTERVAL]: (state, payload) => {
    state.interval = payload
  },
  [MutationTypes.CLEAR_INTERVAL]: state => {
    if (!state.interval) return

    clearInterval(state.interval)
    state.interval = null
  },
  [MutationTypes.SET_DURATIONS]: (state, payload) => {
    if (!state.currentVideoInfo) return

    const { minutes, seconds, time } = convertISO8601Durations(payload)
    state.currentVideoInfo.durations = {
      time,
      timeString: `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`
    }
  },
  [MutationTypes.LOAD_BY_VIDEO_ID]: (state, payload) => {
    state.playerQueue.currentIndex = state.playerQueue.data.findIndex(
      (element: PlayListItem | VideoItem) => element.id === payload
    )

    return ((window as any).player as Player).loadVideoById(payload, 0)
  }
}

export default mutations
