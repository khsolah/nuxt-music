/* eslint-disable no-use-before-define */
import { AxiosResponse } from 'axios'
import {
  ActionContext,
  ActionTree,
  CommitOptions,
  DispatchOptions
} from 'vuex/types/index'
import qs from 'qs'
import { Namespaced } from '..'
import { RootState } from '../state'
import { Getters } from './getters'
import { Mutations, MutationTypes } from './mutations'
import { State } from './state'
import { Player, PlayListItem, VideoItem } from '~/@types'
import { $axios } from '~/utilities/$axios'

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
  PLAYER_INIT = 'PLAYER_INIT',
  PLAY_VIDEO = 'PLAY_VIDEO',
  SEEK_TO = 'SEEK_TO',
  LOAD_BY_VIDEO_ID = 'LOAD_BY_VIDEO_ID',
  FETCH_VIDEO_INFO = 'FETCH_VIDEO_INFO',
  FETCH_PLAYLIST = 'FETCH_PLAYLIST',
  FETCH_VIDEOS = 'FETCH_VIDEOS',
  FETCH_PLAYER_QUEUE = 'FETCH_PLAYER_QUEUE'
}

export interface Actions {
  [ActionTypes.PLAYER_INIT]: (
    { commit }: AugmentedContext,
    payload: string
  ) => void
  [ActionTypes.PLAY_VIDEO]: ({ commit }: AugmentedContext) => void
  [ActionTypes.SEEK_TO]: ({ commit }: AugmentedContext, payload: number) => void
  [ActionTypes.LOAD_BY_VIDEO_ID]: (
    { commit }: AugmentedContext,
    payload: string
  ) => void
  [ActionTypes.FETCH_VIDEO_INFO]: (
    { commit }: AugmentedContext,
    payload: { v: string; playlistId: string | null | undefined }
  ) => Promise<null | VideoItem>
  [ActionTypes.FETCH_PLAYLIST]: (
    { commit }: AugmentedContext,
    playlistId: string
  ) => Promise<PlayListItem[]>
  [ActionTypes.FETCH_VIDEOS]: ({
    commit
  }: AugmentedContext) => Promise<VideoItem[]>
  [ActionTypes.FETCH_PLAYER_QUEUE]: (
    { commit }: AugmentedContext,
    payload: { playlistId?: string | null | undefined; videoId: string }
  ) => Promise<{
    type: 'playlist' | 'videos'
    data: VideoItem[] | PlayListItem[]
  }>
}

export enum PlayerActionTypes {
  PLAYER_INIT = 'Player/PLAYER_INIT',
  PLAY_VIDEO = 'Player/PLAY_VIDEO',
  SEEK_TO = 'Player/SEEK_TO',
  LOAD_BY_VIDEO_ID = 'Player/LOAD_BY_VIDEO_ID',
  FETCH_VIDEO_INFO = 'Player/FETCH_VIDEO_INFO',
  FETCH_PLAYLIST = 'Player/FETCH_PLAYLIST',
  FETCH_VIDEOS = 'Player/FETCH_VIDEOS',
  FETCH_PLAYER_QUEUE = 'Player/FETCH_PLAYER_QUEUE'
}

export interface PlayerActions extends Namespaced<Actions, 'Player'> {}

const actions: ActionTree<State, RootState> & Actions = {
  [ActionTypes.PLAYER_INIT]: ({ commit, dispatch, getters }, payload) => {
    ;(window as any).player = new (window as any).YT.Player('player', {
      height: '100%',
      width: '100%',
      videoId: payload,
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
            commit(MutationTypes.SET_PLAYER_STATUS, 'play')
            target.playVideo()
          })
          ;(
            document.querySelector("div[title='暫停'") as HTMLDivElement
          ).addEventListener('click', () => {
            commit(MutationTypes.SET_PLAYER_STATUS, 'pause')
            target.pauseVideo()
          })
        },
        onStateChange: (event: { data: number }) => {
          const currentTime = ((window as any).player as Player).playerInfo
            .currentTime as number
          const seconds = Math.floor(currentTime % 60)
          const minutes = Math.floor(currentTime / 60)
          commit(MutationTypes.SET_CURRENT_TIME, { seconds, minutes })
          commit(MutationTypes.SET_PROGRESS, Math.floor(currentTime))

          const data = event.data
          if (data === (window as any).YT.PlayerState.PLAYING) {
            commit(MutationTypes.SET_PLAYER_STATUS, 'play')
            dispatch(ActionTypes.PLAY_VIDEO, undefined)
          } else {
            commit(MutationTypes.SET_PLAYER_STATUS, 'pause')
            commit(MutationTypes.CLEAR_INTERVAL, undefined)

            if ((window as any).YT.PlayerState.ENDED === data) {
              // video end
              const { currentIndex, data, type } = getters.GET_PLAYER_QUEUE
              let index
              if (currentIndex === -1) {
                const currentId = getters.GET_CURRENT_VIDEO_INFO!.id
                index =
                  type === 'playlist'
                    ? (data as PlayListItem[]).findIndex(
                        item => item.snippet.resourceId.videoId === currentId
                      )
                    : (data as VideoItem[]).findIndex(
                        item => item.id === currentId
                      )
              }
              const id =
                type === 'playlist'
                  ? (data[index ? index + 1 : currentIndex - 1] as PlayListItem)
                      .snippet.resourceId.videoId
                  : (data[index ? index + 1 : currentIndex - 1] as VideoItem).id
              dispatch(ActionTypes.LOAD_BY_VIDEO_ID, id)
            }
          }
        }
      }
    })
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
  [ActionTypes.SEEK_TO]: ({ commit }, payload) => {
    if (!(window as any).player) return
    ;((window as any).player as Player).seekTo(payload)

    commit(MutationTypes.SET_PROGRESS, Math.floor(payload))
    commit(MutationTypes.SET_CURRENT_TIME, {
      minutes: Math.floor(payload / 60),
      seconds: Math.floor(payload % 60)
    })
  },
  [ActionTypes.LOAD_BY_VIDEO_ID]: ({ commit, dispatch }, payload) => {
    if (!(window as any).player || !(window as any).player.loadVideoById)
      return dispatch(ActionTypes.PLAYER_INIT, payload)

    commit(MutationTypes.LOAD_BY_VIDEO_ID, payload)
  },
  [ActionTypes.FETCH_VIDEO_INFO]: ({ commit }, { v, playlistId }) => {
    return $axios({
      url: `/youtube/v3/videos?${qs.stringify({
        part: 'snippet,contentDetails,statistics',
        id: v,
        videoCategoryId: 10
      })}`,
      method: 'GET'
    })
      .then(({ data: { items } }: AxiosResponse<{ items: VideoItem[] }>) => {
        commit(MutationTypes.SET_CURRENT_VIDEO_INFO, {
          ...items[0],
          playlistId: playlistId || null,
          time: { minutes: 0, seconds: 0 },
          durations: { time: 0, timeString: '00:00' }
        })
        return items[0]
      })
      .catch(() => {
        commit(MutationTypes.SET_CURRENT_VIDEO_INFO, null)
        return null
      })
  },
  [ActionTypes.FETCH_PLAYLIST]: ({ commit }, playlistId) => {
    return $axios({
      url: `/youtube/v3/playlistItems?${qs.stringify({
        part: 'id,snippet',
        playlistId,
        maxResults: 15
      })}`
    })
      .then(({ data: { items } }: AxiosResponse<{ items: PlayListItem[] }>) => {
        commit(MutationTypes.SET_PLAYLIST, items)
        return items
      })
      .catch(() =>  []
      )
  },
  [ActionTypes.FETCH_VIDEOS]: ({ commit }) => {
    return $axios({
      url: `/youtube/v3/videos?${qs.stringify({
        part: 'id,snippet,contentDetails,statistics',
        chart: 'mostPopular',
        regionCode: 'KR',
        videoCategoryId: 10,
        maxResults: 15
      })}`,
      method: 'GET'
    })
      .then(({ data: { items } }: AxiosResponse<{ items: VideoItem[] }>) => {
        commit(MutationTypes.SET_VIDEOS, items)
        return items
      })
      .catch(() => [])
  },
  [ActionTypes.FETCH_PLAYER_QUEUE]: async (
    { commit, dispatch },
    { playlistId, videoId }
  ) => {
    const data = playlistId
      ? await dispatch(ActionTypes.FETCH_PLAYLIST, playlistId)
      : await dispatch(ActionTypes.FETCH_VIDEOS, undefined)

    const currentIndex = data.findIndex(
      (element: VideoItem | PlayListItem) => element.id === videoId
    )

    commit(MutationTypes.SET_CURRENT_QUEUE, {
      type: playlistId ? 'playlist' : 'videos',
      currentIndex,
      data
    })

    return {
      type: playlistId ? 'playlist' : 'videos',
      currentIndex,
      data
    }
  }
}

export default actions
