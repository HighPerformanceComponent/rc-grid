/**
 * title: Scroll To
 * desc: Scroll to the specified location information
 * title.zh-CN: 滚动到指定位置
 * desc.zh-CN: 可通过 `scrollToRow` 或则 `scrollToColumn` 来进行使用
 */

import React, { useRef } from 'react'
import DataGrid, { Cell, Row, AutoSize, GridHandle } from '@lifhcp/rc-grid'

const rows: any[] = []

for (let i=0; i < 10000; i += 1) {

    const cells: Cell[] = [{
        name: 'id',
        value: `${i}`,
    },{
        name: 'userName',
        value: `my name ${i}`,
    },{
        name: 'address',
        value: `address ${i}`,
    },{
        name: 'email',
        value: `E-Mail ${i}`,
    }, {
        name: 'mobilePhone',
        value: `Mobile Phone ${i}`,
    }]
    const row: Row<any> = {
        height: 35,
        key: `key-${i}`,
        cells,
    }
    rows.push(row)
}

const ScrollTo = () => {
    const columns: any[] = [{
        name: 'id',
        title: 'id'
    },{
        name: 'userName',
        title: 'User Name'
    }, {
        name: 'address',
        title: 'Address'
    }, {
        name: 'email',
        title: 'E-Mail'
    }, {
        name: 'mobilePhone',
        title: 'Mobile Phone'
    }]
    const grid = useRef<GridHandle>(null)

    const rowIndex = useRef<number>(12)
    return (
        <>
            <input
                type="number"
                defaultValue={12}
                onChange={(e) => {
                    rowIndex.current = e.target.valueAsNumber
                }}
            />
            <button
                onClick={() => {
                    grid.current?.scrollToRow(rowIndex.current)
                }}
            >
                Scroll To Row
            </button>
            <AutoSize>
                {(width) => (
                    <DataGrid<any>
                        grid={grid}
                        columns={columns}
                        rows={rows}
                        width={width}
                        height={500}
                    />
                )}
            </AutoSize>
        </>
    )
}

export default ScrollTo
