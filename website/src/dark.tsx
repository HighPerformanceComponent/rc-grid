/**
 * title: Dark table
 * desc: Dark theme mode
 * title.zh-CN: 暗黑模式
 * desc.zh-CN: 暗黑模式的主题
 */


 import React from 'react'
 import DataGrid, { Cell, Row, AutoSize, Theme } from '@lifhcp/rc-grid'
 import { ThemeProvider } from 'styled-components'
 
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
 
 const Dark = () => {
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
        <ThemeProvider theme={Theme.dark}>
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
         </ThemeProvider>
 
     )
 }
 
 export default Dark
 