/**
 * title: Sort Data
 * desc: Click on the column header to sort the data
 * title.zh-CN: 数据排序
 * desc.zh-CN: 点击列头，可对数据进行排序
 */


import React, { useRef, useState } from 'react'

import produce from 'immer'

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

const SortData = () => {
    const oldData = useRef<Row<any>[]>(produce(rows, () => {}))
    const [datas, setDatas] = useState<Row<any>[]>(produce(rows, () => {}))
    return (
        <AutoSize>
            {(width) => (
                <DataGrid<unknown>
                    rows={datas}
                    width={width}
                    height={500}
                    columns={tempColumns}
                    onSort={(sort) => {
                        if (sort.length === 0) {
                            setDatas(oldData.current)
                        }
                        if (sort.length > 0) {
                            const { direction } = sort[0]
                            const { columnKey } = sort[0]
                            const rowsData = produce(datas, (newData) => {
                                newData.sort((a, b) => {
                                    const aData: string = a.object[columnKey]
                                    const bData: string = b.object[columnKey]

                                    if (direction === 'ASC') {
                                        if (
                                            aData.toUpperCase() >
                                            bData.toUpperCase()
                                        ) {
                                            return 1
                                        }
                                        return -1
                                    }
                                    if (direction === 'DESC') {
                                        if (
                                            aData.toUpperCase() <
                                            bData.toUpperCase()
                                        ) {
                                            return 1
                                        }
                                    }
                                    return -1
                                })
                            })
                            setDatas(rowsData)
                        }
                    }}
                />
            )}
        </AutoSize>
    )
}


export default SortData
