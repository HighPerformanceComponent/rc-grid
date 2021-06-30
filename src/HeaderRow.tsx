import React, { ReactNode, CSSProperties, useMemo } from 'react'
import styled from 'styled-components'
import { Column } from './types'

interface GridHeaderRowProps extends React.HTMLAttributes<HTMLDivElement> {
    styled: CSSProperties
}

const GridHeaderRow = styled.div.attrs<GridHeaderRowProps>((props) => ({
    style: props.styled,
}))<GridHeaderRowProps>`
    position: sticky;
    z-index: 10;
`

interface GridHeaderCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFixed: boolean
    styled: CSSProperties
}

const GridHeaderCell = styled.div.attrs<GridHeaderCellProps>((props) => ({
    style: props.styled,
}))<GridHeaderCellProps>`
    display: inline-block;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: hsl(0deg 0% 97.5%);
    box-shadow: ${({ isLastFixed }) =>
        isLastFixed ? '2px 0 5px -2px rgb(136 136 136 / 30%)' : undefined};
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
`

const CellBody = styled.div`
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`

interface HeaderRowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    width: number
    columns: readonly Column<R>[]
    estimatedColumnWidth: number
    cacheRemoveCount: number
    styled: CSSProperties
    scrollLeft: number
}

function HeaderRow<R>({
    width,
    style = {},
    columns = [],
    styled: tempStyled = {},
    estimatedColumnWidth,
    cacheRemoveCount,
    scrollLeft,
}: HeaderRowProps<R>) {
    const fixedColumns = useMemo(
        () => columns.filter((ele) => ele.fixed),
        [columns]
    )

    const leftFixedColumns = fixedColumns.filter((ele) => ele.fixed === 'left')
    const renderCell = () => {
        const result: Array<ReactNode> = []
        let left = 0
        columns.some((column) => {
            const columnWidth = column.width || 120
            if (
                left < scrollLeft - estimatedColumnWidth * cacheRemoveCount &&
                column.fixed === undefined
            ) {
                left += columnWidth
                return false
            }

            result.push(
                <GridHeaderCell
                    isLastFixed={
                        leftFixedColumns.length > 0 &&
                        leftFixedColumns[leftFixedColumns.length - 1].name ===
                            column.name
                    }
                    key={`header-${column.name}`}
                    styled={{
                        left,
                        width: columnWidth,
                        position: column.fixed ? 'sticky' : undefined,
                        zIndex: column.fixed ? 11 : undefined,
                    }}
                >
                    <CellBody>{column.title}</CellBody>
                </GridHeaderCell>
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
    }

    return (
        <GridHeaderRow style={style} styled={tempStyled}>
            {renderCell()}
        </GridHeaderRow>
    )
}

export default HeaderRow
