import { createContext, Dispatch } from 'react'

type Action = { type: 'setScrollLeft'; payload: number }

export interface State {
    scrollLeft: number
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
    throw Error(`reducer unknown type [${action.type}]`)
}

export default Context
