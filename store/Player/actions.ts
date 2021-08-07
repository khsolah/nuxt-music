/* eslint-disable no-use-before-define */
import {
  ActionContext,
  ActionTree,
  CommitOptions,
  DispatchOptions
} from 'vuex/types/index'
import { Namespaced } from '..'
import { RootState } from '../state'
import { Getters } from './getters'
import { Mutations, MutationTypes } from './mutations'
import { State } from './state'

interface AugmentedContext
  extends Omit<
    ActionContext<State, RootState>,
    'commit' | 'dispatch' | 'getters'
  > {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>
  dispatch<K extends keyof Actions, P extends Parameters<Actions[K]>[1]>(
    key: K,
    payload: P,
    options?: DispatchOptions
  ): ReturnType<Actions[K]>
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>
  }
}

export enum ActionTypes {
  INIT_PLAYER = 'INIT_PLAYER',
  PLAY_VIDEO = 'PLAY_VIDEO',
  SEEK_TO = 'SEEK_TO'
}

export interface Actions {
  [ActionTypes.INIT_PLAYER]: (
    { commit }: AugmentedContext,
    payload: {
      v: string
    }
  ) => void
  [ActionTypes.PLAY_VIDEO]: ({ commit }: AugmentedContext) => void
  [ActionTypes.SEEK_TO]: ({ commit }: AugmentedContext, payload: number) => void
}

export enum PlayerActionTyoes {
  INIT_PLAYER = 'Player/INIT_PLAYER',
  PLAY_VIDEO = 'Player/PLAY_VIDEO',
  SEEK_TO = 'Player/SEEK_TO'
}

export interface PlayerActions extends Namespaced<Actions, 'Player'> {}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.INIT_PLAYER]: ({ commit, dispatch }, payload) => {
    ;(window as any).onYouTubeIframeAPIReady = () => {
      const player: State['player'] = new (window as any).YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: payload.v,
        events: {
          onReady: ({
            target
          }: {
            target: { playVideo: Function; pauseVideo: Function }
          }) => {
            target.playVideo()
            ;(
              document.querySelector("div[title='播放'") as HTMLDivElement
            ).addEventListener('click', () => {
              console.log('play')
              commit(MutationTypes.SET_PLAYER_STATUS, 'play')
              target.playVideo()
            })
            ;(
              document.querySelector("div[title='暫停'") as HTMLDivElement
            ).addEventListener('click', () => {
              console.log('pause')
              commit(MutationTypes.SET_PLAYER_STATUS, 'pause')
              target.pauseVideo()
            })
          },
          onStateChange: (event: { data: number }) => {
            const currentTime = player!.playerInfo.currentTime as number
            const seconds = Math.floor(currentTime % 60)
            const minutes = Math.floor(currentTime / 60)
            commit(MutationTypes.SET_CURRENT_TIME, { seconds, minutes })
            commit(MutationTypes.SET_PROGRESS, Math.floor(currentTime))

            const data = event.data
            if (data === (window as any).YT.PlayerState.PLAYING) {
              commit(MutationTypes.SET_PLAYER_STATUS, 'play')
              // commit(MutationTypes.SET_INTERVAL, undefined)
              dispatch(ActionTypes.PLAY_VIDEO, undefined)
            } else {
              commit(MutationTypes.SET_PLAYER_STATUS, 'pause')
              commit(MutationTypes.CLEAR_INTERVAL, undefined)
            }
          }
        }
      })
    }
  },
  [ActionTypes.PLAY_VIDEO]: ({ commit, getters }) => {
    const interval = setInterval(() => {
      const progress = getters.GET_PROGRESS + 1
      commit(MutationTypes.SET_PROGRESS, progress)
      commit(MutationTypes.SET_CURRENT_TIME, {
        minutes: Math.floor(progress / 60),
        seconds: Math.floor(progress % 60)
      })
    }, 1000)

    commit(MutationTypes.SET_INTERVAL, interval)
  },
  [ActionTypes.SEEK_TO]: ({ commit, getters }, payload) => {
    if (!getters.GET_PLAYER) return

    commit(MutationTypes.SET_PROGRESS, Math.floor(payload))
    commit(MutationTypes.SET_CURRENT_TIME, {
      minutes: Math.floor(payload / 60),
      seconds: Math.floor(payload % 60)
    })
  }
}

export default actions
