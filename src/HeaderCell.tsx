import React, {
    CSSProperties,
    ReactNode,
    useContext,
    useEffect,
    useRef,
} from 'react'
import styled from 'styled-components'

import Context from './Context'
import type { Column, DataGridProps, SortColumn } from './types'
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
    :hover {
        > i {
            opacity: 0.85;
        }
    }
`

/** 用来显示可以拖拽的鼠标指示 */
const ResizableSpan = styled.span`
    cursor: col-resize;
    position: absolute;
    right: 0px;
    width: 10px;
    height: 100%;
`

const HeaderTitle = styled.span``

export interface HeaderCellProps<T> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    styled: CSSProperties
    column: Column<T>
    children: ReactNode
    gridProps: DataGridProps<T>
}

function HeaderCell<T>({
    isLastFeftFixed,
    isLastRightFixed,
    styled: tempStyled,
    children,
    column,
    gridProps: { columns, onSort, defaultColumnWidth, onHeaderResizable },
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

    const screenX = useRef<number>(0)
    const isResizableEnd = useRef<boolean>(true)

    const columnWidth = useRef<number>(column.width || defaultColumnWidth)
    useEffect(() => {
        const onMouseMove = (event: MouseEvent) => {
            if (screenX.current !== 0 && isResizableEnd.current === false) {
                const offset: number = event.screenX - screenX.current
                const newColumns: Column<T>[] = []
                columns.forEach((ele) => {
                    if (ele.name === column.name) {
                        newColumns.push({
                            ...column,
                            width: columnWidth.current + offset,
                        })
                    } else {
                        newColumns.push(ele)
                    }
                })
                onHeaderResizable?.(newColumns)
            }
        }
        window.addEventListener('mousemove', onMouseMove)
        const onMouseUp = (event: MouseEvent) => {
            if (isResizableEnd.current === false) {
                isResizableEnd.current = true
                const offset: number = event.screenX - screenX.current
                columnWidth.current += offset
                screenX.current = 0
            }
        }
        window.addEventListener('mouseup', onMouseUp)
        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            window.removeEventListener('mouseup', onMouseUp)
        }
    }, [screenX.current, columns, columnWidth])

    const renderResizableSpan = () => {
        if (column.resizable === true) {
            return (
                <ResizableSpan
                    onMouseDown={(event) => {
                        isResizableEnd.current = false
                        screenX.current = event.screenX
                        event.stopPropagation()
                    }}
                />
            )
        }
        return null
    }

    return (
        <GridHeaderCell
            isLastFeftFixed={isLastFeftFixed}
            isLastRightFixed={isLastRightFixed}
            styled={tempStyled}
        >
            <HeaderTitle
                style={{
                    cursor: column.sort === true ? 'pointer' : undefined,
                }}
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
                {children}
            </HeaderTitle>
            {getSortStatus()}
            {renderResizableSpan()}
        </GridHeaderCell>
    )
}

export default HeaderCell
