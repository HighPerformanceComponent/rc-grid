import React, { CSSProperties, ReactNode, useContext } from 'react'
import styled from 'styled-components'

import Context from './Context'
import type { Column, SortColumn } from './types'
import { SortUpIcon, SortDownIcon } from './Icon'

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
    cursor: pointer;
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

export interface HeaderCellProps<T> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    styled: CSSProperties
    column: Column<T>
    children: ReactNode
    onSort?: (sortColumn: SortColumn[]) => void
}

function HeaderCell<T>({
    isLastFeftFixed,
    isLastRightFixed,
    styled: tempStyled,
    children,
    column,
    onSort,
}: HeaderCellProps<T>) {
    const { state, dispatch } = useContext(Context)

    const getSortStatus = () => {
        const result = state.sortColumns.find(
            (ele) => ele.columnKey === column.name
        )
        if (result?.direction === 'ASC') {
            return <SortUpIcon />
        }

        if (result?.direction === 'DESC') {
            return <SortDownIcon />
        }

        return null
    }

    return (
        <GridHeaderCell
            isLastFeftFixed={isLastFeftFixed}
            isLastRightFixed={isLastRightFixed}
            styled={tempStyled}
            onClick={() => {
                if (column.sort === true) {
                    const newSortColumn: SortColumn[] = []
                    let isHaveSortColumns = false
                    state.sortColumns.forEach((ele) => {
                        if (ele.columnKey === column.name) {
                            isHaveSortColumns = true
                            if (ele.direction === 'ASC') {
                                newSortColumn.push({
                                    columnKey: column.name,
                                    direction: 'DESC',
                                })
                            }
                        }
                    })

                    if (isHaveSortColumns === false) {
                        newSortColumn.push({
                            columnKey: column.name,
                            direction: 'ASC',
                        })
                    }

                    // 执行排序逻辑
                    onSort?.(newSortColumn)
                    dispatch({
                        type: 'setSortColumn',
                        payload: newSortColumn,
                    })
                }
            }}
        >
            {children} {getSortStatus()}
        </GridHeaderCell>
    )
}

export default HeaderCell
