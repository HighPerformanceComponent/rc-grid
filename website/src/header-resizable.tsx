/**
 * title: Header Resizable
 * desc: The width information of table columns can be changed
 * title.zh-CN: 列的宽度可调整
 * desc.zh-CN: 可改变表格列的宽度信息
 */

import React, { useState } from 'react'

import DataGrid, { Row, Column, Cell, AutoSize } from '@lifhcp/rc-grid'

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
        resizable: true,
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

const HeaderResizable = () => {
    const [columns, setColumns] = useState<Array<Column<unknown>>>(tempColumns)
    return (
        <AutoSize>
            {(width) => (
                <DataGrid<unknown>
                    rows={rows}
                    width={width}
                    height={500}
                    columns={columns}
                    onHeaderResizable={(changeColumns) => {
                        setColumns(changeColumns)
                    }}
                />
            )}
        </AutoSize>
    )
}

export default HeaderResizable