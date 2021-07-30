import React, { Key, useState } from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'


import DataGrid, { Row, Column, Cell } from '../../src'

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

const RowDataGrid = () => {
    const [select, setSelect] = useState<Key[]>([])
    return (
        <DataGrid<unknown>
            rows={rows}
            columns={tempColumns}
            selectedRows={select}
            onChangeSelectedRows={setSelect}
            select={{
                mode: 'multiple',
                component: (param) => {
                    const { onSelected, row, selected, mode } = param
                    return (
                        <input
                            className="test-checkbox"
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
                },
                headerComponent: () => (
                    <input
                        style={{
                            margin: 0,
                        }}
                        type="checkbox"
                    />
                ),
            }}
        />
    )
}


test('select-multiple test', async () => {
    const { container,  getByRole} = render(<RowDataGrid />)
    await waitFor(() => getByRole('grid'))
    const checkbox = container.querySelectorAll('.test-checkbox')
    fireEvent.click(checkbox[0])
    fireEvent.click(checkbox[1])
    fireEvent.click(checkbox[2])
    fireEvent.click(checkbox[2])
    expect(container).toMatchSnapshot()
})
