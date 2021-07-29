import React, { useRef, useState } from 'react'
import { render, waitFor, screen, fireEvent } from "@testing-library/react"

import DataGrid, { Column, DataGridProps, Row, AutoSize, Cell, GridHandle, EditorProps } from '../../src/index'

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
    rowsData.push(row)
}


interface BashGridProps<T> extends Omit<DataGridProps<T>, 'rows' | 'columns'> {
    /** 表格的行数据信息 */
    rows?: Row<T>[]
    /** 列的信息 */
    columns?: Column<T>[]
}

function BashGrid<T>(props: BashGridProps<T>) {
    const { columns, rows } = props
    return (
        <DataGrid<T>
            columns={columns}
            rows={rows}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    )
}

BashGrid.defaultProps = {
    columns: [{
        name: 'id',
        title: 'id',
        fixed: 'left'
    }, {
        name: 'userName',
        title: 'User Name',
        editor: Input
    }, {
        name: 'address',
        title: 'Address'
    }, {
        name: 'email',
        title: 'E-Mail'
    }, {
        name: 'mobilePhone',
        title: 'Mobile Phone',
        fixed: 'right'
    }],
    rows: []
}


test("grid columns test", () => {
    const bashGrid = render(<BashGrid />)
    expect(bashGrid).toMatchSnapshot()
})

test("auto size test", async () => {
    const Grid= () => {
        const ref = useRef<HTMLDivElement>(null)
        return (
            <div
                ref={ref}
                style={{
                    width: 1200,
                    height: 500
                }}
            >
                <AutoSize>
                    {(autoWidth, autoHeight) => (
                        <BashGrid
                            width={autoWidth}
                            height={autoHeight}
                            rows={rowsData}
                        />
                    )}
                </AutoSize>
            </div>
        )
    }
    const autoSize = render(<Grid />)
    await waitFor(() => screen.getByRole('grid'))
    expect(autoSize).toMatchSnapshot()
})

test('scroll grid test', async () => {
    const Grid= () => {
        const ref = useRef<HTMLDivElement>(null)
        return (
            <div
                ref={ref}
                style={{
                    width: 1200,
                    height: 500
                }}
            >
                <AutoSize>
                    {(autoWidth, autoHeight) => (
                        <BashGrid
                            width={autoWidth}
                            height={autoHeight}
                            rows={rowsData}
                        />
                    )}
                </AutoSize>
            </div>
        )
    }
    const autoSize = render(<Grid />)
    await waitFor(() => screen.getByRole('grid'))
    fireEvent.scroll(screen.getByRole('grid'), {
        y: 500
    })

    fireEvent.scroll(screen.getByRole('grid'), {
        y: 100
    })
    expect(autoSize).toMatchSnapshot()
})

test('scroll to row', async () => {
    const Grid= () => {
        const ref = useRef<HTMLDivElement>(null)
        const grid = useRef<GridHandle>(null)
        return (
            <>
                <div
                    ref={ref}
                    style={{
                        width: 1200,
                        height: 500
                    }}
                >
                    <AutoSize>
                        {(autoWidth, autoHeight) => (
                            <>
                                <button
                                    type="button"
                                    onClick={() => {
                                        grid.current.scrollToRow(100)
                                    }}
                                >
                                    click scroll
                                </button>
                                <BashGrid
                                    grid={grid}
                                    columns={[{
                                        name: 'id',
                                        title: 'id',
                                        fixed: 'right',
                                        isSelect: () => false
                                    }, {
                                        name: 'userName',
                                        title: 'User Name',
                                        isSelect: () => true
                                    }, {
                                        name: 'address',
                                        title: 'Address'
                                    }, {
                                        name: 'email',
                                        title: 'E-Mail'
                                    }, {
                                        name: 'mobilePhone',
                                        title: 'Mobile Phone',
                                        fixed: 'left'
                                    }]}
                                    width={autoWidth}
                                    height={autoHeight}
                                    rows={rowsData}
                                />
                            </>
                        )}
                    </AutoSize>
                </div>
            </>
        )
    }
    const autoSize = render(<Grid />)


    await waitFor(() => screen.getAllByRole('gridcell'))
    fireEvent.click(await screen.findByText('click scroll'))
    expect(autoSize).toMatchSnapshot()
})


test('cell select test', async () => {
    const Grid= () => {
        const ref = useRef<HTMLDivElement>(null)
        return (
            <div
                ref={ref}
                style={{
                    width: 1200,
                    height: 500
                }}
            >
                <AutoSize>
                    {(autoWidth, autoHeight) => (
                        <BashGrid
                            width={autoWidth}
                            height={autoHeight}
                            rows={rowsData}
                        />
                    )}
                </AutoSize>
            </div>
        )
    }
    const autoSize = render(<Grid />)
    await waitFor(() => screen.getByRole('grid'))
    fireEvent.click(screen.getAllByRole('gridcell')[0])
    expect(autoSize).toMatchSnapshot()
})

test('cell editor test', async () => {
    const Grid= () => {
        const ref = useRef<HTMLDivElement>(null)
        return (
            <div
                ref={ref}
                style={{
                    width: 1200,
                    height: 500
                }}
            >
                <AutoSize>
                    {(autoWidth, autoHeight) => (
                        <BashGrid
                            width={autoWidth}
                            height={autoHeight}
                            rows={rowsData}
                        />
                    )}
                </AutoSize>
            </div>
        )
    }
    const autoSize = render(<Grid />)
    await waitFor(() => screen.getByRole('grid'))
    fireEvent.click(screen.getAllByRole('gridcell')[0])
    fireEvent.click(screen.getAllByRole('gridcell')[0])
    expect(autoSize).toMatchSnapshot()
})