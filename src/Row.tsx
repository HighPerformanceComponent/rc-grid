import React, { ReactNode, useContext } from 'react'
import styled from 'styled-components'
import { Column, Row as RowType } from './types'
import Context from './Context'

const GridRow = styled.div`
    position: absolute;
`

const GridCell = styled.div`
    position: absolute;
    height: 100%;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: #fff;
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
`

const CellBody = styled.div`
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

interface RowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    rows: readonly RowType[]
    rowIndex: number
    width: number
    columns: readonly Column<R>[]
    estimatedColumnWidth: number
    cacheRemoveCount: number
}

function Row<R>({
    rows,
    width,
    rowIndex,
    style = {},
    columns = [],
    estimatedColumnWidth,
    cacheRemoveCount,
}: RowProps<R>) {
    const { cells, key, height } = rows[rowIndex]
    const { state } = useContext(Context)
    const renderCell = () => {
        const result: Array<ReactNode> = []

        let left = 0
        columns.some((column, index) => {
            let columnWidth = column.width || 120
            let isCellSpan = false
            const cell = cells.find((ele) => ele.name === column.name)

            const colSpan = cell?.colSpan || 0

            if (colSpan > 0) {
                for (let i = 0; i < colSpan; i += 1) {
                    columnWidth += columns[index + i + 1].width || 120
                    isCellSpan = true
                }
            }

            const rowSpan = cell?.rowSpan || 0

            let rowHeight = height || 35
            if (rowSpan > 0) {
                for (let i = 0; i < rowSpan; i += 1) {
                    rowHeight += rows[rowIndex + i + 1].height || 35
                    isCellSpan = true
                }
            }

            if (
                left <
                state.scrollLeft - estimatedColumnWidth * cacheRemoveCount
            ) {
                left += columnWidth
                return false
            }

            const txt = cell?.value || ''

            result.push(
                <GridCell
                    key={`${key}-${column.name}`}
                    style={{
                        left,
                        zIndex: isCellSpan ? 1 : undefined,
                        width: columnWidth,
                        height: rowHeight,
                    }}
                >
                    <CellBody>{txt}</CellBody>
                </GridCell>
            )
            left += columnWidth
            if (
                left >
                width +
                    state.scrollLeft +
                    estimatedColumnWidth * cacheRemoveCount
            ) {
                return true
            }
            return false
        })
        return result
    }

    return <GridRow style={style}>{renderCell()}</GridRow>
}

export default Row
