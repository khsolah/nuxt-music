import {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions
} from 'vuex/types/index'
import { Actions } from './actions'
import { Getters } from './getters'
import { Mutations } from './mutations'
import { State } from './state'

export type Namespaced<T, U extends string> = {
  [P in keyof T & string as `${U}/${P}`]: T[P]
}

export interface Store
  extends Omit<VuexStore<State>, 'commit' | 'dispatch' | 'getters'> {
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
