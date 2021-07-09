import React, {
    CSSProperties,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components'

import Context from './Context'
import type { Column, DataGridProps, SortColumn } from './types'
import { SortUpIcon, SortDownIcon } from './Icon'

interface GridHeaderCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    isDragHover: boolean
    styled: CSSProperties
}

const GridHeaderCell = styled.div.attrs<GridHeaderCellProps>((props) => ({
    style: props.styled,
}))<GridHeaderCellProps>`
    display: inline-flex;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-left: ${({ isDragHover }) => {
        if (isDragHover) {
            return '2px solid #3740ff'
        }
        return 'unset'
    }};
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
    gridProps: {
        columns,
        onSort,
        defaultColumnWidth,
        onHeaderResizable,
        onHeaderDrop,
        onHeaderDragOver,
    },
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

    const dragRef = useRef<HTMLDivElement>(null)

    const [isDragHover, setIsDragHover] = useState<boolean>(false)
    const isDragCount = useRef<number>(0)
    return (
        <GridHeaderCell
            ref={dragRef}
            isLastFeftFixed={isLastFeftFixed}
            isLastRightFixed={isLastRightFixed}
            isDragHover={isDragHover}
            styled={tempStyled}
            draggable={onHeaderDrop !== undefined}
            data-id={`table-${state.id}`}
            data-name={column.name}
            onDragStart={({ dataTransfer, currentTarget }) => {
                dataTransfer.setData('name', column.name)
                dataTransfer.setData('target', `table-${state.id}`)
                const { dataset } = currentTarget
                dataset.dragstart = 'true'
            }}
            onDrop={(event) => {
                const { dataTransfer, currentTarget } = event 
                const targetElement = currentTarget as HTMLDivElement
                const { style } = targetElement
                style.boxShadow = undefined

                const sourceName = dataTransfer.getData('name')
                const targetName = targetElement.dataset.name
                let sourceCol: Column<T>
                let targetCol: Column<T>
                columns.some((ele) => {
                    if (ele.name === sourceName) {
                        sourceCol = ele
                    } else if (ele.name === targetName) {
                        targetCol = ele
                    }

                    if (sourceCol && targetCol) {
                        return true
                    }
                    return false
                })
                onHeaderDrop?.(sourceCol, targetCol)
                event.stopPropagation()
            }}
            onDragEnter={(e) => {
                const targetElement = e.currentTarget as HTMLDivElement
                if (targetElement.dataset.dragstart !== 'true') {
                    if (e.dataTransfer.getData('name') !== column.name) {
                        isDragCount.current += 1
                        e.preventDefault()
                        if (isDragHover === false) {
                            setIsDragHover(true)
                        }
                    }
                }
            }}
            onDragLeave={(e) => {
                const targetElement = e.currentTarget as HTMLDivElement
                if (targetElement.dataset.dragstart !== 'true') {
                    isDragCount.current -= 1
                    if (isDragCount.current === 0 ) {
                        setIsDragHover(false)
                    }
                }
            }}
            onDragOver={(e) => {
                const targetElement = e.currentTarget as HTMLDivElement
                if (targetElement.dataset.id === `table-${state.id}` && targetElement.dataset.dragstart !== 'true') {
                    if (onHeaderDragOver?.(e)) {
                        e.preventDefault()
                    }
                }
            }}
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
