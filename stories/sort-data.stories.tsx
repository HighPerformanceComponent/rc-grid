import React, { useRef, useState } from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Column, Cell } from '../src'

const rows: Array<Row<any>> = []
const columns: Array<Column<unknown>> = []

columns.push({
    name: `0`,
    title: `字段 - 0`,
    fixed: 'left',
})

for (let i = 2; i < 20; i += 1) {
    columns.push({
        name: `${i}`,
        title: `字段 - ${i}`,
        sort: true,
    })
}

columns.push({
    name: `1`,
    title: `字段 - 1`,
    fixed: 'right',
})

for (let i = 0; i < 500; i += 1) {
    const cells: Array<Cell> = []

    const object: any = {}
    for (let y = 0; y < columns.length; y += 1) {
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
    const oldData = useRef<Row<any>[]>([...rows])
    const [datas, setDatas] = useState<Row<any>[]>(rows)
    return (
        <DataGrid<unknown>
            rows={datas}
            columns={columns}
            onSort={(sort) => {
                if (sort.length === 0) {
                    setDatas(oldData.current)
                }
                if (sort.length > 0) {
                    const { direction } = sort[0]
                    const { columnKey } = sort[0]
                    datas.sort((a, b) => {
                        const aData: string = a.object[columnKey]
                        const bData: string = b.object[columnKey]
                        if (direction === 'ASC') {
                            if (aData.toUpperCase() > bData.toUpperCase()) {
                                return 1
                            }
                            return -1
                        }
                        if (direction === 'DESC') {
                            if (aData.toUpperCase() < bData.toUpperCase()) {
                                return 1
                            }
                        }
                        return -1
                    })
                    setDatas([...datas])
                }
            }}
        />
    )
}

export default {
    component: RowDataGrid,
    title: 'Demos',
} as Meta

export const SortData: React.VFC<{}> = () => <RowDataGrid />
