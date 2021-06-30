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
    isLastFixed: boolean
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
    box-shadow: ${({ isLastFixed }) =>
        isLastFixed ? '2px 0 5px -2px rgb(136 136 136 / 30%)' : undefined};
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
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
    scrollLeft: number
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
    scrollLeft,
    styled: tempStyled = {},
}: RowProps<R>) {
    const { cells, key, height } = rows[rowIndex]
    const { state, dispatch } = useContext(Context)
    const fixedColumns = useMemo(
        () => columns.filter((ele) => ele.fixed),
        [columns]
    )

    const leftFixedColumns = fixedColumns.filter((ele) => ele.fixed === 'left')

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
                        leftFixedColumns.length > 0 &&
                        leftFixedColumns[leftFixedColumns.length - 1].name ===
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
                    <CellBody key={`${key}-${column.name}`} isSelect={isSelect}>
                        {txt}
                    </CellBody>
                </GridCell>
            )
            left += columnWidth
            if (
                left >
                width + scrollLeft + estimatedColumnWidth * cacheRemoveCount
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
