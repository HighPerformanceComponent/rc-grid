import { createContext, Dispatch, Key } from 'react'
import type { EditorChange, SortColumn } from './types'

type Action =
    | {
          type: 'setSelectPosition'
          payload: {
              x: number
              y: string
          }
      }
    | {
          type: 'setEditorChange'
          payload: EditorChange<any>[]
      }
    | {
          type: 'setSortColumn'
          payload: SortColumn[]
      }
    | {
          type: 'setExpandableKey'
          payload: Key[]
      }
    | {
          type: 'setEditPosition'
          payload: {
              rowKey?: string
              colName?: string
          }
      }
    | {
          type: 'setExpandableTreeKey'
          payload: Key[]
      }

export interface State {
    selectPosition?: {
        x: number
        y: string
    }
    editPosition?: {
        rowKey?: string
        colName?: string
    }
    editorChange: EditorChange<any>[]
    expandableKey: Key[]
    expandableTreeKey: Key[]
    sortColumns: SortColumn[]
    id: number
}

const Context = createContext<{
    state: State
    dispatch: Dispatch<Action>
}>({
    state: {
        editorChange: [],
        sortColumns: [],
        expandableKey: [],
        expandableTreeKey: [],
        id: 0,
    },
    dispatch: () => null,
})

export function reducer(state: State, action: Action): State {
    if (action.type === 'setSelectPosition') {
        return { ...state, selectPosition: action.payload }
    }
    if (action.type === 'setEditPosition') {
        return { ...state, editPosition: action.payload }
    }

    if (action.type === 'setEditorChange') {
        return { ...state, editorChange: action.payload }
    }

    if (action.type === 'setSortColumn') {
        return { ...state, sortColumns: action.payload }
    }

    if (action.type === 'setExpandableKey') {
        return { ...state, expandableKey: action.payload }
    }

    if (action.type === 'setExpandableTreeKey') {
        return { ...state, expandableTreeKey: action.payload }
    }

    throw Error(`reducer unknown type [${(action as any).type}]`)
}

export default Context
