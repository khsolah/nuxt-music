export interface State {
  accessToken: string | null
}

const state = (): State => ({
  accessToken: null
})

export type RootState = ReturnType<typeof state>

export default state
