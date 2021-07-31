import React from 'react'
import { render, waitFor, fireEvent } from '@testing-library/react'
import DataGrid, { Cell, Column, Row, } from '../../src'


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
    <DataGrid<unknown>
        rows={rows}
        columns={tempColumns}
        expandable={{
            childrenColumnName: '2',
            isExpandable: (row) => row.key === '2'
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
)

test('tree test', async () => {
    const { container, getByText } = render(<RowDataGrid />)
    await waitFor(() => getByText('2 - 2'))

    const dom = getByText('2 - 2').children[0]
    fireEvent.click(dom)
    fireEvent.click(dom)
    fireEvent.click(dom)
    expect(container).toMatchSnapshot()
})