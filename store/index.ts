import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions
} from 'vuex/types/index'
import { Actions } from './actions'
import { Getters } from './getters'
import { Mutations } from './mutations'
import { PlayerActions } from './Player/actions'
import { PlayerGetters } from './Player/getters'
import { PlayerMutations } from './Player/mutations'
import { State } from './state'

export type Namespaced<T, U extends string> = {
  [P in keyof T & string as `${U}/${P}`]: T[P]
}

interface RootGetters extends Getters, PlayerGetters {}
interface RootMutations extends Mutations, PlayerMutations {}
interface RootActions extends Actions, PlayerActions {}

export interface Store
  extends Omit<VuexStore<State>, 'commit' | 'dispatch' | 'getters'> {
  commit<
    K extends keyof RootMutations,
    P extends Parameters<RootMutations[K]>[1]
  >(
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<RootMutations[K]>
  dispatch<
    K extends keyof RootActions,
    P extends Parameters<RootActions[K]>[1]
  >(
    key: K,
    payload: P,
    options?: DispatchOptions
  ): ReturnType<RootActions[K]>
  getters: {
    [K in keyof RootGetters]: ReturnType<RootGetters[K]>
  }
}
