/**
 * title: Cell editing
 * desc: Provide a cell-editable table, Double click to edit
 * title.zh-CN: 单元格编辑
 * desc.zh-CN: 这是一个简单的自定义单元格编辑的表格, 双击可进行表格编辑
 */
import React, { useState } from 'react'
import DataGrid, { Cell, Row, AutoSize, EditorProps, Column } from '@lifhcp/rc-grid'


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

const Simple = () => {
    const columns: Column<any>[] = [{
        name: 'id',
        title: 'id'
    },{
        name: 'userName',
        title: 'User Name',
        editor: Input,
    }, {
        name: 'address',
        title: 'Address',
        editor: Input,
    }, {
        name: 'email',
        title: 'E-Mail',
        editor: Input,
    }, {
        name: 'mobilePhone',
        title: 'Mobile Phone',
        editor: Input,
    }]
    return (
        <AutoSize>
            {(width) => (
                <DataGrid<any>
                    columns={columns}
                    rows={rows}
                    width={width}
                    height={500}
                    onEditorChangeSave={(change) => {
                        console.log(JSON.stringify(change))
                    }}
                />
            )}
        </AutoSize>

    )
}

export default Simple
