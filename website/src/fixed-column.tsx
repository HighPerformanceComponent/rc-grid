/**
 * title: Fixed Column
 * desc: You can fix the left and right columns of the table
 * title.zh-CN: 固定列
 * desc.zh-CN: 可以使用列的 `fixed` 属性来固定表格列
 */

import React from 'react'

import DataGrid, { Row, Column, Cell, AutoSize } from '@lifhcp/rc-grid'

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
                // rowSpan: 2,
                // colSpan: 2,
            })
        } else if (i === 8 && y === 2) {
            cells.push({
                name: `${y}`,
                value: `${i} - ${y}`,
                // rowSpan: 2,
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

const FixedColumn = () => (
    <AutoSize>
        {(width) => (
            <DataGrid<unknown>
                width={width}
                height={500}
                rows={rows}
                columns={columns}
            />
        )}
    </AutoSize>
)

export default FixedColumn
