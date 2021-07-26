/**
 * title: Header Merge
 * desc: You can customize the merge column header information
 * title.zh-CN: 列头合并
 * desc.zh-CN: 可以自定义合并列头信息
 */

import React from 'react'

import styled from 'styled-components'
import DataGrid, { Row, Column, Cell, AutoSize } from '@lifhcp/rc-grid'

const rows: Array<Row<any>> = []
const columns: Array<Column<unknown>> = [
    {
        name: `0`,
        title: `姓名`,
        width: 120,
    },
    {
        name: `1`,
        title: `年龄`,
        width: 120,
    },
    {
        name: `2`,
        title: `身份证号`,
        width: 120,
    },
    {
        name: `3`,
        title: `家庭地址`,
        width: 120,
    },
    {
        name: `4`,
        title: `家庭电话号码`,
        width: 120,
    },
    {
        name: `5`,
        title: `家庭人员数量`,
        width: 120,
    },
    {
        name: `6`,
        title: `公司地址`,
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

    for (let y = 0; y < columns.length; y += 1) {
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
        cells,
    })
}

const HeaderMergeDataGrid = () => (
    <AutoSize>
        {(width) => (
            <DataGrid<unknown>
                rows={rows}
                width={width}
                height={500}
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
                onHeaderCellRender={({ headerCell, index }) => {
                    const {
                        styled: tempStyled,
                        ...restProps
                    } = headerCell.props
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
                            </GridHeaderCell>,
                            headerCell,
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
                            }),
                        ]
                    }
                    return [
                        React.cloneElement(headerCell, {
                            ...restProps,
                            styled: {
                                ...tempStyled,
                            },
                        }),
                    ]
                }}
            />
        )}
    </AutoSize>
)

export default HeaderMergeDataGrid
