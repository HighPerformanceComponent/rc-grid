import React, { ReactNode, CSSProperties, useMemo } from 'react'
import styled from 'styled-components'

import { DataGridProps } from './types'
import HeaderCell from './HeaderCell'

interface GridHeaderRowProps extends React.HTMLAttributes<HTMLDivElement> {
    styled: CSSProperties
}

const GridHeaderRow = styled.div.attrs<GridHeaderRowProps>((props) => ({
    style: props.styled,
}))<GridHeaderRowProps>`
    position: sticky;
    z-index: 10;
`

interface HeaderRowProps<T>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    scrollWidth: number
    styled: CSSProperties
    scrollLeft: number
    gridProps: DataGridProps<T>
}

function HeaderRow<R>({
    style = {},
    styled: tempStyled = {},
    scrollLeft,
    scrollWidth,
    gridProps: {
        width,
        columns = [],
        defaultColumnWidth,
        estimatedColumnWidth,
        cacheRemoveCount,
        onHeaderCellRender = ({ headerCell }) => [headerCell],
    },
}: HeaderRowProps<R>) {
    const fixedColumns = useMemo(
        () => columns.filter((ele) => ele.fixed),
        [columns]
    )

    const leftFixedColumns = fixedColumns.filter((ele) => ele.fixed === 'left')
    const rightFixedColumns = fixedColumns.filter(
        (ele) => ele.fixed === 'right'
    )

    const renderCell = () => {
        const result: Array<ReactNode> = []
        let left = 0
        columns.some((column, index) => {
            const columnWidth = column.width || defaultColumnWidth

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

            const cellStyled: CSSProperties = {
                left,
                width: columnWidth,
                position: column.fixed ? 'sticky' : undefined,
                zIndex: column.fixed ? 11 : undefined,
            }

            if (column.fixed === 'right') {
                cellStyled.left = undefined
                cellStyled.float = 'right'
                cellStyled.right =
                    scrollWidth - left - (column.width || defaultColumnWidth)
            }

            const headerCell = onHeaderCellRender({
                index,
                column,
                headerCell: (
                    <HeaderCell
                        key={`header-${column.name}`}
                        isLastFeftFixed={
                            leftFixedColumns.length > 0 &&
                            leftFixedColumns[leftFixedColumns.length - 1]
                                .name === column.name
                        }
                        isLastRightFixed={
                            rightFixedColumns.length > 0 &&
                            rightFixedColumns[0].name === column.name
                        }
                        styled={cellStyled}
                    >
                        {column.title}
                    </HeaderCell>
                ),
            })
            result.splice(-1, 0, headerCell)
            left += columnWidth
            return false
        })
        return result
    }

    return (
        <GridHeaderRow style={style} styled={tempStyled}>
            {renderCell()}
        </GridHeaderRow>
    )
}

export default HeaderRow
