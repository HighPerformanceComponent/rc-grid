import React from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Column } from '../src'

const rows: Array<Row<unknown>> = []
const columns: Array<Column<unknown>> = []

for (let i = 0; i < 1000; i += 1) {
    columns.push({
        name: `${i}`,
        title: `${i}`,
    })
}

for (let i = 0; i < 1000; i += 1) {
    const data: any = {}
    for (let y = 0; y < 1000; y += 1) {
        data[`${y}`] = `${i} - ${y}`
    }
    rows.push({
        height: 35,
        key: `${i}`,
        data,
    })
}

const RowDataGrid = () => <DataGrid<unknown> rows={rows} columns={columns} />

export default {
    component: RowDataGrid,
    title: 'Demos/rows',
} as Meta

export const Primary: React.VFC<{}> = () => <RowDataGrid />
