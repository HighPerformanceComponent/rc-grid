import React, { useRef, useState } from 'react'
import { render, waitFor, screen, fireEvent } from "@testing-library/react"
import produce from 'immer'

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


test("grid columns test", () => {
    const bashGrid = render(<BashGrid />)
    expect(bashGrid).toMatchSnapshot()
})

test("auto size test", async () => {
    const Grid = () => {
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
    const Grid = () => {
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
    const Grid = () => {
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
    const Grid = () => {
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
    const Grid = () => {
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
    fireEvent.blur(screen.getAllByRole('gridcell')[0])
    expect(autoSize).toMatchSnapshot()
})

test('grid sort test', async () => {
    const Grid = () => (
        <BashGrid
            width={1200}
            height={500}
            rows={rowsData}
        />
    )
    const grid = render(<Grid />)
    await waitFor(() => screen.getByRole('grid'))
    const element = await screen.findByText('User Name')
    fireEvent.click(element)
    fireEvent.click(element)
    fireEvent.click(element)
    expect(grid).toMatchSnapshot()
})

test('search grid test', async () => {
    const Grid = () => (
        <BashGrid
            width={1200}
            height={500}
            rows={rowsData}
        />
    )
    const grid = render(<Grid />)
    await waitFor(() => grid.getByRole('grid'))

    fireEvent.keyDown(grid.getByRole('grid'), {
        key: 'f',
        ctrlKey: true
    })


    await waitFor(() => grid.getByRole('search'))

    const search = grid.getByRole('search').children[0] as HTMLInputElement
    search.focus()

    fireEvent.change(search, { target: { value: '10000' } })
    fireEvent.keyDown(search, {
        key: 'Enter'
    })
    fireEvent.keyDown(search,{
        key: 'Escape'
    })
    expect(grid).toMatchSnapshot()
})

test('grid columns resizable test', async () => {
    const Grid = () => (
        <BashGrid
            width={1200}
            height={500}
            rows={rowsData}
        />
    )
    const {container, getByRole, findByText} = render(<Grid />)
    await waitFor(() => getByRole('grid'))
    const element = await findByText('User Name')
    const span = element.nextElementSibling
    
    const options = {
        screenX: 500
    }

    fireEvent.mouseDown(span, options)
    fireEvent.mouseMove(span, options)
    fireEvent.mouseMove(span, {
        screenX: 800
    })
    fireEvent.mouseUp(span, {
        screenX: 800
    })

    const header = getByRole('rowheader')
    const userNameHeader = header.children[1] as HTMLDivElement

    expect(userNameHeader.style.width).toBe('420px')
    expect(container).toMatchSnapshot()
})

