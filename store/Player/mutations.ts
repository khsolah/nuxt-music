import { MutationTree } from 'vuex/types/index'
import { Namespaced } from '..'
import { State } from './state'
import convertISO8601Durations from '~/utilities/convertDurations'

export enum MutationTypes {
  SET_PLAYER_STATUS = 'SET_PLAYER_STATUS',
  SET_CURRENT_TIME = 'SET_CURRENT_TIME',
  SET_PROGRESS = 'SET_PROGRESS',
  SET_INTERVAL = 'SET_INTERVAL',
  CLEAR_INTERVAL = 'CLEAR_INTERVAL',
  SET_DURATIONS = 'SET_DURATIONS'
}

export interface Mutations<S = State> {
  [MutationTypes.SET_PLAYER_STATUS]: (
    state: S,
    payload: State['playerStatus']
  ) => void
  [MutationTypes.SET_CURRENT_TIME]: (
    state: S,
    payload: State['currentTime']
  ) => void
  [MutationTypes.SET_PROGRESS]: (state: S, payload: number) => void
  [MutationTypes.SET_INTERVAL]: (state: S, payload: NodeJS.Timer) => void
  [MutationTypes.CLEAR_INTERVAL]: (state: S) => void
  [MutationTypes.SET_DURATIONS]: (state: S, payload: string) => void
}

export enum PlayerMutationTypes {
  SET_PLAYER_STATUS = 'Player/SET_PLAYER_STATUS',
  SET_CURRENT_TIME = 'Player/SET_CURRENT_TIME',
  SET_PROGRESS = 'Player/SET_PROGRESS',
  SET_INTERVAL = 'Player/SET_INTERVAL',
  CLEAR_INTERVAL = 'Player/CLEAR_INTERVAL',
  SET_DURATIONS = 'Player/SET_DURATIONS'
}

export interface PlayerMutations extends Namespaced<Mutations, 'Player'> {}

const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.SET_PLAYER_STATUS]: (state, payload) => {
    state.playerStatus = payload
  },
  [MutationTypes.SET_CURRENT_TIME]: (state, payload) => {
    state.currentTime = payload
  },
  [MutationTypes.SET_PROGRESS]: (state, payload) => {
    state.progress = payload
  },
  [MutationTypes.SET_INTERVAL]: (state, payload) => {
    state.interval = /* setInterval(() => {
      state.progress++
      state.currentTime = {
        minutes: Math.floor(state.progress / 60),
        seconds: state.progress % 60
      }
    }, 1000) */ payload
  },
  [MutationTypes.CLEAR_INTERVAL]: state => {
    if (!state.interval) return

    clearInterval(state.interval)
    state.interval = null
  },
  [MutationTypes.SET_DURATIONS]: (state, payload) => {
    const { minutes, seconds, time } = convertISO8601Durations(payload)
    state.durations = {
      time,
      timeString: `${minutes < 10 ? `0${minutes}` : minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
      }`
    }
  }
}

export default mutations