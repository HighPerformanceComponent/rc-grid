import React, { useEffect, useState } from 'react'
import { Meta } from '@storybook/react'
import produce from 'immer'

import DataGrid, { Row, Column, Cell } from '../src'

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
                value: `${i} - ${y} test`,
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
    useEffect(() => {
        setTimeout(() => {
            // eslint-disable-next-line no-alert
            alert('请按快捷键 ctrl + f 进行数据搜索')
        }, 1000);
    }, [])
    const [datas] = useState<Row<any>[]>(produce(rows, () => {}))
    return <DataGrid<unknown> rows={datas} columns={tempColumns} />
}

export default {
    component: RowDataGrid,
    title: 'Demos',
} as Meta

export const FilterData: React.VFC<{}> = () => <RowDataGrid />
