import React from 'react'
import { Meta } from '@storybook/react'

import DataGrid, { Row, Cell, AutoSize } from '../src'

const rows: any[] = []

for (let i=0; i < 100; i += 1) {

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

const footRows = {
    height: 35,
    key: 'footRows',
    cells: [{
        name: 'id',
        value: `count: 10000`,
    },{
        name: 'userName',
        value: `max: zhangj`,
    },{
        name: 'address',
        value: `min: WuHan`,
    },{
        name: 'email',
        value: `test@email.com`,
    }, {
        name: 'mobilePhone',
        value: '+86 110',
    }],
}

const FootGrid = () => {
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
                    footRows={footRows}
                    rows={rows}
                    width={width}
                    height={500}
                />
            )}
        </AutoSize>

    )
}

export default {
    component: FootGrid,
    title: 'Demos',
} as Meta

export const Foot: React.VFC<{}> = () => <FootGrid />