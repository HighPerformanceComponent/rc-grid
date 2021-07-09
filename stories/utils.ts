import produce from 'immer'
import { Column } from '../src'

// eslint-disable-next-line import/prefer-default-export
export function onHeaderDrop<T>(
    columns: Column<T>[],
    source: Column<T>,
    target: Column<T>
) {
    const sourceIndex = columns.findIndex((ele) => ele.name === source.name)
    const targetIndex = columns.findIndex((ele) => ele.name === target.name)
    return produce(columns, (changeColumns) => {
        changeColumns.splice(sourceIndex, 1, target)
        changeColumns.splice(targetIndex, 1, source)
    })
}
