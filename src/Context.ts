import { createContext, Dispatch } from 'react'

type Action =
    | { type: 'setScrollLeft'; payload: number }
    | {
          type: 'setSelectPosition'
          payload: {
              x: number
              y: number
          }
      }

export interface State {
    scrollLeft: number
    selectPosition?: {
        x: number
        y: number
    }
}

const Context = createContext<{
    state: State
    dispatch: Dispatch<Action>
}>({
    state: {
        scrollLeft: 0,
    },
    dispatch: () => null,
})

export function reducer(state: State, action: Action): State {
    if (action.type === 'setScrollLeft') {
        return { ...state, scrollLeft: action.payload }
    }
    if (action.type === 'setSelectPosition') {
        return { ...state, selectPosition: action.payload }
    }
    throw Error(`reducer unknown type [${(action as any).type}]`)
}

export default Context
