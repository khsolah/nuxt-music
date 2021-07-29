export interface State {
  accessToken: string | null
  refreshToken: string | null
}

const state = (): State => ({
  accessToken: null,
  refreshToken: null
})

export type RootState = ReturnType<typeof state>

export default state
