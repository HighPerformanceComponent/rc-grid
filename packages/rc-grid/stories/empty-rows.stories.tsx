import React from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Column, AutoSize } from '../src'

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

const RowDataGrid = () => (
    <AutoSize>
        {(width, height) => (
            <DataGrid<unknown>
                rows={rows}
                width={width}
                height={height}
                columns={columns}
                onEmptyRowsRenderer={() => (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        无任何数据
                    </div>
                )}
            />
        )}
    </AutoSize>
)

export default {
    component: RowDataGrid,
    title: 'Demos',
} as Meta

export const EmptyRows: React.VFC<{}> = () => <RowDataGrid />
