import React, { CSSProperties, ReactNode, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Column, Row as RowType } from './types'
import Context from './Context'

interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    styled: CSSProperties
}

const GridRow = styled.div.attrs<GridRowProps>((props) => ({
    style: props.styled,
}))<GridRowProps>`
    position: absolute;
`

interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    isSelect: boolean
    styled: CSSProperties
}

const GridCell = styled.div.attrs<GridCellProps>((props) => ({
    style: props.styled,
}))<GridCellProps>`
    display: inline-block;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: #fff;
    outline: none;
    box-shadow: ${({ isLastFeftFixed, isLastRightFixed, isSelect }) => {
        if (isSelect) {
            return 'inset 0 0 0 2px #66afe9'
        }

        if (isLastFeftFixed) {
            return '2px 0 5px -2px rgb(136 136 136 / 30%)'
        }
        if (isLastRightFixed) {
            return '-3px 0 5px -2px rgb(136 136 136 / 30%)'
        }
        return undefined
    }};
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;
`

interface RowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    rows: readonly RowType[]
    rowIndex: number
    width: number
    columns: readonly Column<R>[]
    estimatedColumnWidth: number
    cacheRemoveCount: number
    scrollLeft: number
    scrollWidth: number
    styled: CSSProperties
    defaultColumnWidth: number
}

function Row<R>({
    rows,
    width,
    rowIndex,
    style = {},
    columns = [],
    estimatedColumnWidth,
    cacheRemoveCount,
    scrollLeft,
    scrollWidth,
    defaultColumnWidth,
    styled: tempStyled = {},
}: RowProps<R>) {
    const { cells, key, height } = rows[rowIndex]
    const { state, dispatch } = useContext(Context)
    const fixedColumns = useMemo(
        () => columns.filter((ele) => ele.fixed),
        [columns]
    )

    const leftFixedColumns = fixedColumns.filter((ele) => ele.fixed === 'left')
    const rightFixedColumns = fixedColumns.filter(
        (ele) => ele.fixed === 'right'
    )

    const renderCell = useMemo(() => {
        const result: Array<ReactNode> = []
        let left = 0
        const isMergeCell: Array<number> = []
        columns.some((column, index) => {
            let columnWidth = column.width || 120
            if (
                left < scrollLeft - estimatedColumnWidth * cacheRemoveCount &&
                column.fixed === undefined
            ) {
                left += columnWidth
                return false
            }

            if (
                left + columnWidth >
                    width +
                        scrollLeft +
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
                    columnWidth +=
                        columns[columnIndex].width || defaultColumnWidth
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

            const cellStyled: CSSProperties = {
                left,
                zIndex,
                width: columnWidth,
                height: rowHeight,
                lineHeight: `${rowHeight}px`,
            }

            if (column.fixed === 'right') {
                cellStyled.left = undefined
                cellStyled.float = 'right'
                cellStyled.right =
                    scrollWidth - left - (column.width || defaultColumnWidth)
            }

            result.push(
                <GridCell
                    key={`${key}-${column.name}`}
                    style={{
                        ...(cell?.style || {}),
                        position: column.fixed ? 'sticky' : undefined,
                    }}
                    styled={cellStyled}
                    isLastFeftFixed={
                        leftFixedColumns.length > 0 &&
                        leftFixedColumns[leftFixedColumns.length - 1].name ===
                            column.name
                    }
                    isLastRightFixed={
                        rightFixedColumns.length > 0 &&
                        rightFixedColumns[0].name === column.name
                    }
                    isSelect={isSelect}
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
                    {txt}
                </GridCell>
            )
            left += columnWidth

            return false
        })
        return result
    }, [
        columns,
        estimatedColumnWidth,
        cacheRemoveCount,
        scrollLeft,
        state.selectPosition,
    ])

    return (
        <GridRow styled={tempStyled} style={style}>
            {renderCell}
        </GridRow>
    )
}

export default Row
