import React, {
    cloneElement,
    CSSProperties,
    isValidElement,
    Key,
    ReactNode,
    useContext,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components'

import type { Column, DataGridProps, Row } from './types'
import DataGridRow from './Row'
import HeaderRow from './HeaderRow'
import Context, { reducer } from './Context'
import UniversalToolbar from './ plugins/UniversalToolbar'
import { useChevronRightIcon, useChevronDownIcon } from './Icon'
import { getScrollbarWidth } from './utils/browser'

const GridContainer = styled.div`
    position: relative;
`

const Grid = styled.div`
    position: relative;
    overflow: auto;
    border: 1px solid #ddd;
    outline: none;
`

const ExpandableIcon = styled.i`
    width: 16px;
    height: 16px;
    cursor: pointer;
`

function useExpandableRender<T>(
    row: Row<T>,
    isExpandable: (data: Row<T>) => boolean
) {
    const { state, dispatch } = useContext(Context)
    let icon = useChevronRightIcon()
    if (isExpandable?.(row) === false) {
        return null
    }

    const expandable = state.expandableKey.includes(row.key)

    if (expandable) {
        icon = useChevronDownIcon()
    }

    return (
        <ExpandableIcon
            onClick={() => {
                const newKeys: Key[] = []
                if (expandable) {
                    state.expandableKey.forEach((ele) => {
                        if (ele !== row.key) {
                            newKeys.push(ele)
                        }
                    })
                } else {
                    newKeys.push(...state.expandableKey, row.key)
                }
                dispatch({
                    type: 'setExpandableKey',
                    payload: newKeys,
                })
            }}
        >
            {icon}
        </ExpandableIcon>
    )
}

// 设置页面唯一ID
let id = 0

function DataGrid<R>(props: DataGridProps<R>) {
    const {
        className,
        style = {},
        rows,
        height,
        width,
        columns,
        estimatedRowHeight,
        estimatedColumnWidth,
        headerRowHeight,
        cacheRemoveCount,
        defaultColumnWidth,
        expandable,
        onEmptyRowsRenderer,
        onHeaderRowRender = (node: JSX.Element) => node,
        onChildrenRows,
    } = props

    const [state, dispatch] = useReducer(reducer, {
        editorChange: [],
        sortColumns: [],
        expandableKey: [],
        expandableTreeKey: [],
        id: (id += 1),
    })

    const [universalValue, setUniversalValue] = useState<string>('')
    const [isShowUniversal, setIsShowUniversal] = useState<boolean>(false)

    const gridRef = useRef<HTMLDivElement>(null)

    /** 数据进行排序, 方便固定列进行排序 */
    const sortColumns = useMemo(() => {
        const newColumns = [...columns]
        newColumns.sort((before) => {
            if (before.fixed === 'left') {
                return -1
            }
            if (before.fixed === 'right') {
                return 1
            }
            return 0
        })

        // 如果展开行属性存在, 那么进行新增展开逻辑
        if (expandable) {
            const expandableColumn: Column<R> = {
                name: '$expandable',
                title: '',
                width: 35,
                isSelect: () => false,
                fixed: 'left',
                render: (_text, row) =>
                    useExpandableRender(row, expandable?.isExpandable),
            }
            newColumns.splice(0, 0, expandableColumn)
        }

        const cols: Column<R>[] = []
        let widthOffset: number = 0
        let countWidth: number = 0
        newColumns.forEach((ele) => {
            if (typeof ele.width === 'number') {
                widthOffset += ele.width
            } else {
                cols.push(ele)
            }
            countWidth += ele.width || defaultColumnWidth
        })

        // 如果列没有占满, 那么就进行自动分配
        if (countWidth < width) {
            cols.forEach((ele) => {
                const col = ele
                col.width = Math.floor(
                    (width - widthOffset - getScrollbarWidth()) / cols.length
                )
            })
        }

        return newColumns
    }, [columns, width])

    const filterRows = useMemo(
        () =>
            rows.filter((row) => {
                const { cells } = row
                if (universalValue !== '') {
                    const result = cells.some((cell) => {
                        if (cell.value.indexOf(universalValue) !== -1) {
                            return true
                        }
                        return false
                    })
                    return result
                }
                return true
            }),
        [universalValue, rows]
    )

    // 滚动的高度
    const scrollHeight = useMemo(() => {
        let result = 0
        filterRows.forEach((row) => {
            result += row.height
        })
        return result
    }, [filterRows])

    // 滚动的宽度
    const scrollWidth = useMemo(() => {
        let result = 0
        sortColumns.forEach((column) => {
            result += column.width || defaultColumnWidth
        })
        return result
    }, [sortColumns, defaultColumnWidth])

    const startRowTop = useRef<number>(0)
    const [scrollTop, setScrollTop] = useState<number>(0)
    const [scrollLeft, setScrollLeft] = useState<number>(0)
    const [isScroll, setIsScroll] = useState<boolean>(false)

    const calcCacheRemove = estimatedColumnWidth * cacheRemoveCount

    // 渲染表格的行信息
    const renderRow = useMemo(() => {
        // 过滤找到的内容信息
        const domRows: Array<ReactNode> = []
        let top = startRowTop.current
        const headerStyled: CSSProperties = {
            height: headerRowHeight,
            top,
            width: scrollWidth,
        }
        const headerRow: JSX.Element = (
            <HeaderRow
                key="header"
                scrollLeft={scrollLeft}
                scrollWidth={scrollWidth}
                styled={headerStyled}
                gridProps={{
                    ...props,
                    columns: sortColumns,
                }}
            />
        )

        domRows.push(onHeaderRowRender(headerRow))

        top += headerRowHeight
        filterRows.some((row) => {
            const index = rows.findIndex((ele) => ele.key === row.key)
            if (top < scrollTop - calcCacheRemove) {
                top += row.height
                return false
            }

            domRows.push(
                <DataGridRow<R>
                    key={row.key}
                    rows={rows}
                    rowIndexCode="row"
                    rowIndex={index}
                    width={width}
                    level={0}
                    scrollWidth={scrollWidth}
                    scrollLeft={scrollLeft}
                    styled={{
                        height: row.height,
                        top,
                        width: scrollWidth,
                        lineHeight: `${row.height}px`,
                    }}
                    gridProps={{
                        ...props,
                        columns: sortColumns,
                    }}
                />
            )

            top += row.height

            const renderExpandedRowRender = (parent: Row<R>) => {
                // 计算表格的可展开
                if (
                    expandable?.expandedRowRender &&
                    state.expandableKey.includes(parent.key)
                ) {
                    const expandableElement = expandable?.expandedRowRender(
                        parent,
                        {
                            top,
                            width: scrollWidth,
                            position: 'absolute',
                            lineHeight: `${parent.height}px`,
                            boxSizing: 'border-box',
                            borderBottom: `1px solid #ddd`,
                            padding: 10,
                        }
                    )
                    if (isValidElement(expandableElement)) {
                        const {
                            style: pStyle = {},
                            ...restProps
                        } = expandableElement.props
                        const expandableHeight = pStyle.height || 300
                        domRows.push(
                            cloneElement(expandableElement, {
                                key: `${parent.key}-expandable`,
                                style: {
                                    ...pStyle,
                                    height: expandableHeight,
                                },
                                ...restProps,
                            })
                        )
                        top += expandableHeight
                    }
                }
            }

            renderExpandedRowRender(row)

            const renderChildrenRows = (parent: Row<R>, level: number) => {
                // 计算表格树
                if (
                    expandable?.childrenColumnName &&
                    state.expandableTreeKey.includes(parent.key)
                ) {
                    const childrenRows = onChildrenRows?.(parent) || []
                    childrenRows.forEach((child, childIndex) => {
                        domRows.push(
                            <DataGridRow<R>
                                key={`tree-${parent.key}-${child.key}`}
                                rows={childrenRows}
                                rowIndex={childIndex}
                                rowIndexCode={`tree-${parent.key}`}
                                level={level}
                                width={width}
                                scrollWidth={scrollWidth}
                                scrollLeft={scrollLeft}
                                styled={{
                                    height: parent.height,
                                    top,
                                    width: scrollWidth,
                                    lineHeight: `${child.height}px`,
                                }}
                                gridProps={{
                                    ...props,
                                    columns: sortColumns,
                                    rows: childrenRows,
                                }}
                            />
                        )
                        top += child.height
                        renderExpandedRowRender(child)
                        renderChildrenRows(
                            child,
                            level + (expandable.indentSize || 1)
                        )
                    })
                }
            }

            renderChildrenRows(row, 1)
            if (top > height + scrollTop + calcCacheRemove) {
                return true
            }
            return false
        })
        return domRows
    }, [
        scrollTop,
        scrollLeft,
        filterRows,
        sortColumns,
        estimatedColumnWidth,
        width,
        height,
        cacheRemoveCount,
        headerRowHeight,
        rows,
        estimatedRowHeight,
        state.selectPosition,
        state.expandableKey,
        state.expandableTreeKey,
    ])

    const lastScrollTop = useRef<number>(0)
    const lastScrollLeft = useRef<number>(0)

    const timeout = useRef<ReturnType<typeof setTimeout>>()

    const onScroll = ({
        currentTarget,
    }: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (timeout.current) {
            clearTimeout(timeout.current)
        } else if (isScroll === false) {
            setIsScroll(true)
        }

        timeout.current = setTimeout(() => {
            setIsScroll(false)
            timeout.current = undefined
        }, 400)

        const {
            scrollTop: currentScrollTop,
            scrollLeft: currentScrollLeft,
        } = currentTarget
        if (currentTarget) {
            if (
                // 纵向： currentScrollTop - lastScrollTop.current 距离上次滚动的距离
                Math.abs(currentScrollTop - lastScrollTop.current) >
                calcCacheRemove - (estimatedColumnWidth * cacheRemoveCount) / 10
            ) {
                setScrollTop(currentScrollTop)
                lastScrollTop.current = currentTarget.scrollTop
            }

            if (
                // 横向: currentScrollLeft - lastScrollLeft.current 距离上次滚动的距离
                Math.abs(currentScrollLeft - lastScrollLeft.current) >
                calcCacheRemove - (estimatedColumnWidth * cacheRemoveCount) / 10
            ) {
                setScrollLeft(currentScrollLeft)
                lastScrollLeft.current = currentScrollLeft
            }
        }
    }

    const renderUniversal = () => {
        if (isShowUniversal) {
            return (
                <UniversalToolbar
                    value={universalValue}
                    onChange={setUniversalValue}
                    onBlur={() => {
                        gridRef.current.focus()
                        setIsShowUniversal(!isShowUniversal)
                    }}
                />
            )
        }
        return null
    }

    return (
        <Context.Provider
            value={{
                state,
                dispatch,
            }}
        >
            <GridContainer
                style={{
                    width,
                    height,
                }}
            >
                {renderUniversal()}
                <Grid
                    ref={gridRef}
                    className={className}
                    style={{
                        height: '100%',
                        width: '100%',
                        ...style,
                    }}
                    tabIndex={-1}
                    onKeyDown={(e) => {
                        if (e.key === 'f' && e.ctrlKey) {
                            setIsShowUniversal(!isShowUniversal)
                            e.preventDefault()
                        }
                    }}
                    onScroll={onScroll}
                >
                    <div
                        style={{
                            height: scrollHeight,
                            pointerEvents: isScroll ? 'none' : undefined,
                        }}
                    >
                        {renderRow}
                    </div>
                    {rows.length === 0 && onEmptyRowsRenderer ? (
                        <div
                            style={{
                                height: '100%',
                                width,
                                position: 'sticky',
                                left: 0,
                            }}
                        >
                            {onEmptyRowsRenderer()}
                        </div>
                    ) : undefined}
                </Grid>
            </GridContainer>
        </Context.Provider>
    )
}

DataGrid.defaultProps = {
    width: 1000,
    height: 600,
    defaultColumnWidth: 120,
    estimatedRowHeight: 50,
    estimatedColumnWidth: 120,
    headerRowHeight: 35,
    cacheRemoveCount: 6,
}

export default DataGrid
