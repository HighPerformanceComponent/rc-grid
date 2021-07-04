import React from 'react'
import { Meta } from '@storybook/react'

import styled from 'styled-components'
import DataGrid, { Row, Column, Cell, EditorProps } from '../src'


const rows: Array<Row<any>> = []

const Input = ({
    style,
    value,
    onEditCompleted,
    onChange
}: EditorProps) => {
    return (
        <input
            autoFocus
            style={style}
            value={value as string}
            onBlur={() => {
                onEditCompleted()
            }}
            onChange={(e) => {
                const text = e.target.value
                onChange(text)
            }}
        />
    )
}
const columns: Array<Column<unknown>> = [
    {
        name: `0`,
        title: `姓名`,
        editor: Input
    },
    {
        name: `1`,
        title: `年龄`,
        editor: Input
    },
    {
        name: `2`,
        title: `身份证号`,
        editor: Input
    },
    {
        name: `3`,
        title: `家庭地址`,
        editor: Input
    },
    {
        name: `4`,
        title: `家庭电话号码`,
        editor: Input
    },
    {
        name: `5`,
        title: `家庭人员数量`,
        editor: Input
    },
    {
        name: `6`,
        title: `公司名称`,
        editor: Input
    },
    {
        name: `7`,
        title: `公司地址`,
        editor: Input
    },
    {
        name: `8`,
        title: `公司电话号码`,
        editor: Input
    },
]

const GridHeaderCell = styled.div`
    display: inline-block;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: hsl(0deg 0% 97.5%);
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
`

for (let i = 0; i < 5000; i += 1) {
    const cells: Array<Cell> = []

    const object: any = {}
    for (let y = 0; y < columns.length; y += 1) {
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
        columns={columns}
        onHeaderRowRender={(node) => {
            const { styled: tempStyled, ...restProps } = node.props
            return React.cloneElement(node, {
                ...restProps,
                styled: {
                    ...tempStyled,
                    top: 35,
                },
                key: node.key,
            })
        }}
        onEditorChange={(change) => {
            console.log(change)
        }}
        onHeaderCellRender={({ headerCell, index }) => {
            const { styled: tempStyled, ...restProps } = headerCell.props
            if (index === 0) {
                return [
                    <GridHeaderCell
                            key="merge-header-cell"
                            style={{
                                width: 120 * 6,
                                height: 35,
                                position: 'absolute',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 100,
                                left: tempStyled.left,
                                top: (tempStyled.top || 0) - 35,
                            }}
                        >
                        人员资料
                    </GridHeaderCell>
                    ,
                    headerCell
                ]
            }

            if (index > 5) {
                return [
                    React.cloneElement(headerCell, {
                        ...restProps,
                        styled: {
                            ...tempStyled,
                            top: -35,
                            height: 35 * 2,
                        },
                    })
                ]
            }
            return [
                React.cloneElement(headerCell, {
                    ...restProps,
                    styled: {
                        ...tempStyled,
                    },
                })
            ]
        }}
    />
)

export default {
    component: RowDataGrid,
    title: 'Demos',
} as Meta

export const CellEditor: React.VFC<{}> = () => <RowDataGrid />
