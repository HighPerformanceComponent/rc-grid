import React, { useRef, useState } from 'react'
import { Meta } from '@storybook/react'
import produce from 'immer'

import DataGrid, { Row, Column, Cell, AutoSize } from '../src'
import { onHeaderDrop } from './utils'

const rows: Array<Row<any>> = []
const tempColumns: Array<Column<unknown>> = []

tempColumns.push({
    name: `0`,
    title: `字段 - 0`,
    fixed: 'left',
})

for (let i = 2; i < 20; i += 1) {
    tempColumns.push({
        name: `${i}`,
        title: `字段 - ${i}`,
        sort: true,
    })
}

tempColumns.push({
    name: `1`,
    title: `字段 - 1`,
    fixed: 'right',
})

for (let i = 0; i < 500; i += 1) {
    const cells: Array<Cell> = []

    const object: any = {}
    for (let y = 0; y < tempColumns.length; y += 1) {
        object[`${y}`] = `${i} - ${y}`
        if (i === 3 && y === 2) {
            cells.push({
                name: `${y}`,
                value: `${i} - ${y}`,
                style: {},
            })
        } else if (i === 8 && y === 2) {
            cells.push({
                name: `${y}`,
                value: `${i} - ${y}`,
                style: {},
            })
        } else {
            cells.push({
                name: `${y}`,
                value: `${i} - ${y}`,
            })
        }
    }
    rows.push({
        height: 35,
        key: `${i}`,
        object,
        cells,
    })
}

const RowDataGrid = () => {
    const oldData = useRef<Row<any>[]>(produce(rows, () => {}))
    const [datas, setDatas] = useState<Row<any>[]>(produce(rows, () => {}))
    const [cols, setCols] = useState<Column<unknown>[]>(tempColumns)
    return (
        <AutoSize>
            {(width, height) => (
                <DataGrid<unknown>
                    rows={datas}
                    width={width}
                    height={height}
                    columns={cols}
                    onHeaderDrop={(source, target) => {
                        setCols(onHeaderDrop(cols, source, target))
                    }}
                    onSort={(sort) => {
                        if (sort.length === 0) {
                            setDatas(oldData.current)
                        }
                        if (sort.length > 0) {
                            const { direction } = sort[0]
                            const { columnKey } = sort[0]
                            const rowsData = produce(datas, (newData) => {
                                newData.sort((a, b) => {
                                    const aData: string = a.object[columnKey]
                                    const bData: string = b.object[columnKey]

                                    if (direction === 'ASC') {
                                        if (
                                            aData.toUpperCase() >
                                            bData.toUpperCase()
                                        ) {
                                            return 1
                                        }
                                        return -1
                                    }
                                    if (direction === 'DESC') {
                                        if (
                                            aData.toUpperCase() <
                                            bData.toUpperCase()
                                        ) {
                                            return 1
                                        }
                                    }
                                    return -1
                                })
                            })
                            setDatas(rowsData)
                        }
                    }}
                />
            )}
        </AutoSize>
    )
}

export default {
    component: RowDataGrid,
    title: 'Demos',
} as Meta

export const SortData: React.VFC<{}> = () => <RowDataGrid />
