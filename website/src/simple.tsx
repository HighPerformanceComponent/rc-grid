import React from 'react'
import DataGrid, { Cell, Row, AutoSize } from '@lifhcp/rc-grid'


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
    return (
        <AutoSize>
            {(width) => (
                <DataGrid<any>
                    columns={columns}
                    rows={rows}
                    width={width}
                    height={500}
                />
            )}
        </AutoSize>

    )
}

export default Simple
