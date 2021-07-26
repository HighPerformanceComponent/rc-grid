/**
 * title: Select Multiple
 * desc: Select items can be set by configuring the properties of 'select'
 * title.zh-CN: 多选
 * desc.zh-CN: 可通过配置 `select` 的属性来设置选择项
 */


import React, { Key, useState } from 'react'

import DataGrid, { Row, Column, Cell, AutoSize } from '@lifhcp/rc-grid'

const rows: Array<Row<any>> = []
const tempColumns: Array<Column<unknown>> = []

tempColumns.push({
    name: `0`,
    title: `字段 - 0`,
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

const SelectMultiple = () => {
    const [select, setSelect] = useState<Key[]>([])
    return (
        <AutoSize>
            {(width) => (
                <DataGrid<unknown>
                    rows={rows}
                    width={width}
                    height={500}
                    columns={tempColumns}
                    selectedRows={select}
                    onChangeSelectedRows={setSelect}
                    select={{
                        mode: 'multiple',
                        component: (param) => {
                            const { onSelected, row, selected, mode } = param
                            return (
                                <input
                                    style={{
                                        margin: 0,
                                    }}
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => {
                                        onSelected(row, mode)
                                    }}
                                />
                            )
                        }
                    }}
                />
            )}
        </AutoSize>
    )
}

export default SelectMultiple