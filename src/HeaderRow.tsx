import React, { ReactNode, CSSProperties, useMemo } from 'react'
import styled from 'styled-components'
import { Column, HeaderCellRenderParam } from './types'

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
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    styled: CSSProperties
}

const GridHeaderCell = styled.div.attrs<GridHeaderCellProps>((props) => ({
    style: props.styled,
}))<GridHeaderCellProps>`
    display: inline-flex;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    height: 100%;
    align-items: center;
    background-color: hsl(0deg 0% 97.5%);
    box-shadow: ${({ isLastFeftFixed, isLastRightFixed }) => {
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
`

interface HeaderRowProps<R>
    extends Pick<React.HTMLAttributes<HTMLDivElement>, 'style'> {
    width: number
    scrollWidth: number
    columns: readonly Column<R>[]
    estimatedColumnWidth: number
    cacheRemoveCount: number
    styled: CSSProperties
    scrollLeft: number
    defaultColumnWidth: number
    /** 渲染表格头部的单元格 */
    onHeaderCellRender?: (param: HeaderCellRenderParam<R>) => ReactNode
}

function HeaderRow<R>({
    width,
    style = {},
    columns = [],
    styled: tempStyled = {},
    estimatedColumnWidth,
    cacheRemoveCount,
    scrollLeft,
    scrollWidth,
    defaultColumnWidth,
    onHeaderCellRender,
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
                    <GridHeaderCell
                        isLastFeftFixed={
                            leftFixedColumns.length > 0 &&
                            leftFixedColumns[leftFixedColumns.length - 1]
                                .name === column.name
                        }
                        isLastRightFixed={
                            rightFixedColumns.length > 0 &&
                            rightFixedColumns[0].name === column.name
                        }
                        key={`header-${column.name}`}
                        styled={cellStyled}
                    >
                        {column.title}
                    </GridHeaderCell>
                ),
            })
            result.push(headerCell)
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

HeaderRow.defaultProps = {
    onHeaderCellRender: (param: HeaderCellRenderParam<any>) => param.headerCell,
}

export default HeaderRow
