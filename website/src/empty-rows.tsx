/**
 * title: Empty Rows
 * desc: When the data is empty, you can customize the display content through `onEmptyRowsRenderer`
 * title.zh-CN: 空数据显示
 * desc.zh-CN: 在空数据的时候可以通过 `onEmptyRowsRenderer` 自定义显示内容
 */
import React from 'react'

import DataGrid, { Row, Column, AutoSize } from '@lifhcp/rc-grid'

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

const EmptyRows = () => (
    <AutoSize>
        {(width) => (
            <DataGrid<unknown>
                rows={rows}
                width={width}
                height={500}
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

export default EmptyRows;