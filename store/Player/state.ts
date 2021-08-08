import { PlayListItem, VideoItem } from '~/@types'

export interface State {
  playerSlotStyle: {
    width: string
    height: string
    top: string
    left: string
    right: string
    bottom: string
  } | null
  playerStatus: 'play' | 'pause'
  currentVideoInfo: null | (VideoItem & { playlistId: string | null })
  playlist: PlayListItem[]
  videos: VideoItem[]
  playerQueue: {
    type: 'playlist' | 'videos'
    data: PlayListItem[] | VideoItem[]
  }
  currentTime: {
    seconds: number
    minutes: number
  }
  durations: {
    time: number
    timeString: string
  }
  progress: number
  interval: NodeJS.Timer | null
}

const state = (): State => ({
  playerSlotStyle: null,
  playerStatus: 'play',
  currentVideoInfo: null,
  playlist: [],
  videos: [],
  playerQueue: {
    type: 'videos',
    data: []
  },
  currentTime: {
    seconds: 0,
    minutes: 0
  },
  durations: {
    time: 0,
    timeString: '00:00'
  },
  progress: 0,
  interval: null
})

export interface PlayerState {
  Player: State
}

export default state
