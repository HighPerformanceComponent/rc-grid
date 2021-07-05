import { createContext, Dispatch } from 'react'
import { EditorChange } from './types'

type Action =
| {
    type: 'setSelectPosition'
    payload: {
        x: number
        y: number
    }
} 
| {
    type: 'setEditorChange'
    payload: EditorChange<any>[]
}

export interface State {
    selectPosition?: {
        x: number
        y: number
    },
    editorChange: EditorChange<any>[]
}

const Context = createContext<{
    state: State
    dispatch: Dispatch<Action>
}>({
    state: {
        editorChange: []
    },
    dispatch: () => null,
})

export function reducer(state: State, action: Action): State {
    if (action.type === 'setSelectPosition') {
        return { ...state, selectPosition: action.payload }
    }

    if (action.type === 'setEditorChange') {
        return { ...state, editorChange: action.payload }
    }

    throw Error(`reducer unknown type [${(action as any).type}]`)
}

export default Context
