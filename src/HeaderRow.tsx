import React, { useContext, ReactNode, CSSProperties } from 'react'
import styled from 'styled-components'
import { Column } from './types'
import Context from './Context'

interface GridHeaderRowProps extends React.HTMLAttributes<HTMLDivElement> {
    styled: CSSProperties
}

const GridHeaderRow = styled.div<GridHeaderRowProps>`
    position: sticky;
    z-index: 10;
    height: ${(props) => `${props.styled.height}px`};
    top: ${(props) => `${props.styled.top}px`};
    width: ${(props) => `${props.styled.width}px`};
    line-height: ${(props) => props.styled.lineHeight};
`

interface GridHeaderCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFixed: boolean
    styled: CSSProperties
}

const GridHeaderCell = styled.div<GridHeaderCellProps>`
    display: inline-block;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    background-color: hsl(0deg 0% 97.5%);
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
}

function HeaderRow<R>({
    width,
    style = {},
    columns = [],
    styled: tempStyled = {},
    estimatedColumnWidth,
    cacheRemoveCount,
}: HeaderRowProps<R>) {
    const { state } = useContext(Context)
    const fixedColumns = columns.filter((ele) => ele.fixed === 'left')

    const renderCell = () => {
        const result: Array<ReactNode> = []

        let left = 0
        columns.some((column) => {
            const columnWidth = column.width || 120
            if (
                left <
                    state.scrollLeft -
                        estimatedColumnWidth * cacheRemoveCount &&
                column.fixed === undefined
            ) {
                left += columnWidth
                return false
            }

            result.push(
                <GridHeaderCell
                    isLastFixed={
                        fixedColumns.length > 0 &&
                        fixedColumns[fixedColumns.length - 1].name ===
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

    return (
        <GridHeaderRow style={style} styled={tempStyled}>
            {renderCell()}
        </GridHeaderRow>
    )
}

export default HeaderRow
