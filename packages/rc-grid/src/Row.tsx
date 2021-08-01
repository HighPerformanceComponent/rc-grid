import React, { CSSProperties, ReactNode, useContext, useMemo } from 'react'
import styled from 'styled-components'
import { Row as RowType, DataGridProps } from './types'
import Context from './Context'
import Cell from './Cell'

interface GridRowProps extends React.HTMLAttributes<HTMLDivElement> {
    styled: CSSProperties
    isSelect: boolean
}

const GridRow = styled.div.attrs<GridRowProps>((props) => ({
    style: props.styled,
}))<GridRowProps>`
    position: absolute;
    background-color: ${(props) => {
        if (props.isSelect) {
            return 'hsl(0deg 0% 96%)';
        }
        return '#fff'
    }};
    :hover {
        background-color: hsl(0deg 0% 96%);
    }
`

interface RowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    rows: readonly RowType<R>[]
    rowIndex: number
    rowIndexCode: string
    width: number
    level: number
    scrollLeft: number
    scrollWidth: number
    styled: CSSProperties
    gridProps: DataGridProps<R>
}

function Row<T>({
    rows,
    rowIndex,
    scrollLeft,
    scrollWidth,
    styled: tempStyled = {},
    rowIndexCode,
    level,
    gridProps,
}: RowProps<T>) {
    const {
        defaultColumnWidth,
        columns = [],
        estimatedColumnWidth,
        cacheRemoveCount,
        width,
        onRowClick,
        onRowDoubleClick,
    } = gridProps
    const { cells, key, height } = rows[rowIndex]
    const { state, dispatch } = useContext(Context)
    const fixedColumns = useMemo(() => columns.filter((ele) => ele.fixed), [
        columns,
    ])

    const leftFixedColumns = fixedColumns.filter((ele) => ele.fixed === 'left')
    const rightFixedColumns = fixedColumns.filter(
        (ele) => ele.fixed === 'right'
    )

    const renderCell = useMemo(() => {
        const result: Array<ReactNode> = []
        let left = 0
        const isMergeCell: Array<number> = []
        columns.some((column, index) => {
            let columnWidth = column.width || defaultColumnWidth
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
                state.selectPosition?.y === `${rowIndexCode}-${rowIndex}`

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
                <Cell<T>
                    key={`${key}-${column.name}`}
                    column={column}
                    level={level}
                    style={cell?.style}
                    styled={{
                        ...cellStyled,
                        position: column.fixed ? 'sticky' : undefined,
                    }}
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
                        if (column.isSelect?.(cell) !== false) {
                            dispatch({
                                type: 'setSelectPosition',
                                payload: {
                                    x: index,
                                    y: `${rowIndexCode}-${rowIndex}`,
                                },
                            })
                        }
                    }}
                    row={rows[rowIndex]}
                    value={txt}
                    girdProps={gridProps}
                    onFocus={() => {
                        // if (column.isSelect?.(cell) !== false) {
                        //     dispatch({
                        //         type: 'setSelectPosition',
                        //         payload: {
                        //             x: index,
                        //             y: `${rowIndexCode}-${rowIndex}`,
                        //         },
                        //     })
                        // }
                    }}
                />
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
        <GridRow
            role="row"
            styled={tempStyled}
            isSelect={gridProps.selectedRows.includes(key)}
            onClick={() => {
                onRowClick?.(rows[rowIndex])
            }}
            onDoubleClick={() => {
                onRowDoubleClick?.(rows[rowIndex])
            }}
        >
            {renderCell}
        </GridRow>
    )
}

export default Row
