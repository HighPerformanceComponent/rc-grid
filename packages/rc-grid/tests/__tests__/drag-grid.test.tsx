import React, { useRef, useState } from 'react'
import { render, fireEvent, waitFor } from "@testing-library/react"
import produce from 'immer'

import DataGrid, { Column, DataGridProps, Row, Cell, EditorProps } from '../../src/index'

function onHeaderDrop<T>(
    columns: Column<T>[],
    source: Column<T>,
    target: Column<T>
) {
    const sourceIndex = columns.findIndex((ele) => ele.name === source.name)
    const targetIndex = columns.findIndex((ele) => ele.name === target.name)
    return produce(columns, (changeColumns) => {
        changeColumns.splice(sourceIndex, 1)
        changeColumns.splice(targetIndex, 0, source)
    })
}


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
    const [cols, setCols] = useState<Column<T>[]>(columns)
    
    return (
        <DataGrid<T>
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
            columns={cols}
            rows={datas}
            onHeaderResizable={(newCols) => {
                setCols(newCols)
            }}
            onHeaderDrop={(source, target) => {
                setCols(onHeaderDrop(cols, source, target))
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
    rows: []
}

test('grid header drag', async () => {
    const { container, findByText, getByText } = render((<BashGrid width={1200} rows={rowsData} />))

    await waitFor(() => getByText('User Name'))

    const address = await findByText('Address')
    const userName = await findByText('User Name')

    fireEvent.drag(address, {
        dataTransfer: {
            name: 'address'
        }
    })
    fireEvent.drop(userName, {
        dataTransfer: {
            name: 'address',
            getData: () => 'address'
        }
    })

    expect(container).toMatchSnapshot()
})