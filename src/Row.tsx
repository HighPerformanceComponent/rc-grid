import React, { CSSProperties, ReactNode, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Column, Row as RowType } from './types'
import Context from './Context'

interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    styled: CSSProperties
}

const GridRow = styled.div<GridRowProps>`
    position: absolute;
    height: ${(props) => `${props.styled.height}px`};
    top: ${(props) => `${props.styled.top}px`};
    width: ${(props) => `${props.styled.width}px`};
    line-height: ${(props) => props.styled.lineHeight};
`

interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFixed: boolean
    styled: CSSProperties
}

const GridCell = styled.div<GridCellProps>`
    display: inline-block;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: #fff;
    outline: none;
    box-shadow: ${({ isLastFixed }) =>
        isLastFixed ? '2px 0 5px -2px rgb(136 136 136 / 30%)' : undefined};
    left: ${(props) => `${props.styled.left}px`};
    position: ${(props) => props.styled.position};
    z-index: ${(props) => props.styled.zIndex};
    width: ${(props) => `${props.styled.width}px`};
    height: ${(props) => `${props.styled.height}px`};
    line-height: ${(props) => props.styled.lineHeight};
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
    will-change: transform;
`

interface CellBodyProps extends React.HTMLAttributes<HTMLDivElement> {
    isSelect: boolean
}

const CellBody = styled.div<CellBodyProps>`
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
    box-shadow: ${({ isSelect }) =>
        isSelect ? 'inset 0 0 0 2px #66afe9' : undefined};
`

interface RowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    rows: readonly RowType[]
    rowIndex: number
    width: number
    columns: readonly Column<R>[]
    estimatedColumnWidth: number
    cacheRemoveCount: number
    styled: CSSProperties
}

function Row<R>({
    rows,
    width,
    rowIndex,
    style = {},
    columns = [],
    estimatedColumnWidth,
    cacheRemoveCount,
    styled: tempStyled = {},
}: RowProps<R>) {
    const { cells, key, height } = rows[rowIndex]
    const { state, dispatch } = useContext(Context)
    const fixedColumns = columns.filter((ele) => ele.fixed === 'left')
    const renderCell = useMemo(() => {
        const result: Array<ReactNode> = []
        let left = 0
        const isMergeCell: Array<number> = []
        columns.some((column, index) => {
            let columnWidth = column.width || 120
            if (
                left <
                    state.scrollLeft -
                        estimatedColumnWidth * cacheRemoveCount &&
                column.fixed === undefined
            ) {
                left += columnWidth
                return false
            }

            if (isMergeCell.includes(index)) {
                return false
            }

            let isCellSpan = false
            const cell = cells.find((ele) => ele.name === column.name)

            const colSpan = cell?.colSpan || 0

            if (colSpan > 0) {
                for (let i = 0; i < colSpan; i += 1) {
                    const columnIndex = index + i + 1
                    isMergeCell.push(columnIndex)
                    columnWidth += columns[columnIndex].width || 120
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

            const txt = cell?.value || ''

            const isSelect =
                state.selectPosition?.x === index &&
                state.selectPosition?.y === rowIndex

            let zIndex

            if (isCellSpan) {
                zIndex = 1
            }
            if (column.fixed) {
                zIndex = 2
            }
            result.push(
                <GridCell
                    key={`${key}-${column.name}`}
                    style={{
                        ...(cell?.style || {}),
                        position: column.fixed ? 'sticky' : undefined,
                    }}
                    styled={{
                        left,
                        zIndex,
                        width: columnWidth,
                        height: rowHeight,
                        lineHeight: `${rowHeight}px`,
                    }}
                    isLastFixed={
                        fixedColumns.length > 0 &&
                        fixedColumns[fixedColumns.length - 1].name ===
                            column.name
                    }
                    onClick={() => {
                        dispatch({
                            type: 'setSelectPosition',
                            payload: {
                                x: index,
                                y: rowIndex,
                            },
                        })
                    }}
                >
                    <CellBody isSelect={isSelect}>{txt}</CellBody>
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
    }, [
        columns,
        estimatedColumnWidth,
        cacheRemoveCount,
        state.scrollLeft,
        state.selectPosition,
    ])

    return (
        <GridRow styled={tempStyled} style={style}>
            {renderCell}
        </GridRow>
    )
}

export default Row
