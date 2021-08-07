export interface State {
  player: {
    playerInfo: {
      currentTime: number
    }
    seekTo: () => void
  } | null
  playerStatus: 'play' | 'pause'
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
  player: null,
  playerStatus: 'play',
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
