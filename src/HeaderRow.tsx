import React, { useContext, ReactNode } from 'react'
import styled from 'styled-components'
import { Column } from './types'
import Context from './Context'

const GridHeaderRow = styled.div`
    position: sticky;
    z-index: 1;
    background-color: hsl(0deg 0% 97.5%);
`

const GridHeaderCell = styled.div`
    position: absolute;
    height: 100%;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
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
}

function HeaderRow<R>({
    width,
    style = {},
    columns = [],
    estimatedColumnWidth,
    cacheRemoveCount,
}: HeaderRowProps<R>) {
    const { state } = useContext(Context)
    const renderCell = () => {
        const result: Array<ReactNode> = []

        let left = 0
        columns.some((column) => {
            const columnWidth = column.width || 120
            if (
                left <
                state.scrollLeft - estimatedColumnWidth * cacheRemoveCount
            ) {
                left += columnWidth
                return false
            }
            result.push(
                <GridHeaderCell
                    key={`header-${column.name}`}
                    style={{
                        left,
                        width: columnWidth,
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

    return <GridHeaderRow style={style}>{renderCell()}</GridHeaderRow>
}

export default HeaderRow
