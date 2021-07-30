import React, { useRef, useState } from 'react'
import { render, waitFor, fireEvent } from "@testing-library/react"
import produce from 'immer'

import DataGrid, { Column, DataGridProps, Row, Cell, EditorProps } from '../../src/index'


const Input = ({ style, value: tempValue, onEditCompleted }: EditorProps) => {
    const [value, setValue] = useState(tempValue)
    return (
        <input
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            style={style}
            value={value as string}
            onBlur={() => {
                onEditCompleted(value)
            }}
            onChange={(e) => {
                const text = e.target.value
                setValue(text)
            }}
        />
    )
}


const rowsData: any[] = []

for (let i = 0; i < 10000; i += 1) {

    const cells: Cell[] = [{
        name: 'id',
        value: `${i}`,
    }, {
        name: 'userName',
        value: `my name ${i}`,
    }, {
        name: 'address',
        value: `address ${i}`,
    }, {
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
        object: {
            id: `${i}`,
            userName: `my name ${i}`,
            address: `address ${i}`,
            email: `E-Mail ${i}`,
            mobilePhone: `Mobile Phone ${i}`
        }
    }
    rowsData.push(row)
}


interface BashGridProps<T> extends Omit<DataGridProps<T>, 'rows' | 'columns'> {
    /** 表格的行数据信息 */
    rows?: Row<T>[]
    /** 列的信息 */
    columns?: Column<T>[]
}

function BashGrid<T>(props: BashGridProps<T>) {
    const { columns, rows, ...restProps} = props

    const oldData = useRef<Row<any>[]>(produce(rows, () => { }))
    const [datas, setDatas] = useState<Row<any>[]>(produce(rows, () => { }))
    const [col, setCol] = useState<Column<T>[]>(columns)
    
    return (
        <DataGrid<T>
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
            columns={col}
            rows={datas}
            onHeaderResizable={(newCols) => {
                setCol(newCols)
            }}
            expandable={{
                isExpandable: (row) => {
                    const { id } = row.object as any
                    if (id === '1') {
                        return false
                    }
                    return true
                },
                expandedRowRender: (row, style) => (
                    <div style={style}>
                        {' '}
                        这是一个展开的内容信息 {JSON.stringify(row)}{' '}
                    </div>
                ),
            }}
            onSort={(sort) => {
                if (sort.length === 0) {
                    setDatas(oldData.current)
                }
                if (sort.length > 0) {
                    const { direction } = sort[0]
                    const { columnKey } = sort[0]
                    const tempRowData = produce(datas, (newData) => {
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
                    setDatas(tempRowData)
                }
            }}
        />
    )
}


BashGrid.defaultProps = {
    columns: [{
        name: 'id',
        title: 'id',
        sort: true,
        resizable: true,
        fixed: 'left'
    }, {
        name: 'userName',
        sort: true,
        resizable: true,
        title: 'User Name',
        editor: Input
    }, {
        name: 'address',
        sort: true,
        resizable: true,
        title: 'Address'
    }, {
        name: 'email',
        sort: true,
        resizable: true,
        title: 'E-Mail'
    }, {
        name: 'mobilePhone',
        title: 'Mobile Phone',
        sort: true,
        resizable: true,
        fixed: 'right'
    }],
    rows: rowsData
}


test('expandable grid test', async () => {
    const { container, getAllByRole } =render((
        <BashGrid />
    ))
    await waitFor(() => getAllByRole('row'))
    const expandableIcon =  getAllByRole('row')[0].children[0].children[0]
    fireEvent.click(expandableIcon)
    fireEvent.click(expandableIcon)
    fireEvent.click(expandableIcon)

    const twoExpandableIcon =  getAllByRole('row')[3].children[0].children[0]
    fireEvent.click(twoExpandableIcon)
    fireEvent.click(twoExpandableIcon)
    fireEvent.click(twoExpandableIcon)
    expect(container).toMatchSnapshot()
})