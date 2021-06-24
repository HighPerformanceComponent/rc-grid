import React from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Column, Cell } from '../src'

const rows: Array<Row> = []
const columns: Array<Column<unknown>> = []

columns.push({
    name: `0`,
    title: `字段 - 0`,
})

for (let i = 1; i < 1000; i += 1) {
    columns.push({
        name: `${i}`,
        title: `字段 - ${i}`,
    })
}

for (let i = 0; i < 1000; i += 1) {
    const cells: Array<Cell> = []

    for (let y = 0; y < 1000; y += 1) {
        if (i === 3 && y === 0) {
            cells.push({
                name: `${y}`,
                value: `${i} - ${y}`,
                colSpan: 3,
                rowSpan: 3,
                style: {
                    backgroundColor: '#ffb300',
                    textAlign: 'center',
                },
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

const RowDataGrid = () => <DataGrid<unknown> rows={rows} columns={columns} />

export default {
    component: RowDataGrid,
    title: 'Demos/rows',
} as Meta

export const CustomCell: React.VFC<{}> = () => <RowDataGrid />
