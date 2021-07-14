import React from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Column, Cell, AutoSize } from '../src'

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

const RowDataGrid = () => (
    <AutoSize>
        {(width, height) => (
            <DataGrid<unknown>
                rows={rows}
                width={width}
                height={height}
                columns={tempColumns}
                expandable={{
                    childrenColumnName: '2',
                    expandedRowRender: (row, style) => (
                        <div style={style}>
                            这是一个展开的内容信息 {JSON.stringify(row)}{' '}
                        </div>
                    ),
                }}
                onChildrenRows={(row) => {
                    const tempRow = []
                    for (let i = 500; i < 510; i += 1) {
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
                        tempRow.push({
                            height: 35,
                            key: `${row.key}-${i}`,
                            object,
                            cells,
                        })
                    }
                    return tempRow
                }}
            />
        )}
    </AutoSize>
)

export default {
    component: RowDataGrid,
    title: 'Demos',
} as Meta

export const TreeRow: React.VFC<{}> = () => <RowDataGrid />
