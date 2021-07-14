import React, { useState } from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Column, Cell, AutoSize } from '../src'
import { onHeaderDrop } from './utils'

const rows: Array<Row<any>> = []
const columns: Array<Column<unknown>> = []

columns.push({
    name: `0`,
    title: `字段 - 0`,
    fixed: 'left',
})

for (let i = 2; i < 1000; i += 1) {
    columns.push({
        name: `${i}`,
        title: `字段 - ${i}`,
    })
}

columns.push({
    name: `1`,
    title: `字段 - 1`,
    fixed: 'right',
})

for (let i = 0; i < 5000; i += 1) {
    const cells: Array<Cell> = []

    for (let y = 0; y < 1000; y += 1) {
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
        cells,
    })
}

const RowDataGrid = () => {
    const [cols, setCols] = useState<Column<unknown>[]>(columns)
    return (
        <AutoSize>
            {(width, height) => (
                <DataGrid<unknown>
                    rows={rows}
                    columns={cols}
                    width={width}
                    height={height}
                    onHeaderDrop={(source, target) => {
                        setCols(onHeaderDrop(cols, source, target))
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

export const BigData: React.VFC<{}> = () => <RowDataGrid />
