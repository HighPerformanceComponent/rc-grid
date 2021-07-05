import React, {
    CSSProperties,
    ReactNode,
    useMemo,
    useReducer,
    useRef,
    useState,
} from 'react'
import styled from 'styled-components'

import type { DataGridProps } from './types'
import DataGridRow from './Row'
import HeaderRow from './HeaderRow'
import Context, { reducer } from './Context'

const Grid = styled.div`
    position: relative;
    overflow: auto;
    border: 1px solid #ddd;
    outline: none;
    
`

function DataGrid<R>({
    className,
    style = {},
    rows,
    height = 500,
    width = 1000,
    columns,
    estimatedRowHeight = 50,
    estimatedColumnWidth = 120,
    headerRowHeight = 35,
    cacheRemoveCount = 6,
    defaultColumnWidth = 120,
    onHeaderCellRender,
    onEmptyRowsRenderer,
    onHeaderRowRender = (node: JSX.Element) => node,
    onEditorChange,
}: DataGridProps<R>) {
    const [state, dispatch] = useReducer(reducer, {
        editorChange: []
    })

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
        return newColumns
    }, [columns])

    // 滚动的高度
    const scrollHeight = useMemo(() => {
        let result = 0
        rows.forEach((row) => {
            result += row.height
        })
        return result
    }, [rows])

    // 滚动的宽度
    const scrollWidth = useMemo(() => {
        let result = 0
        columns.forEach((column) => {
            result += column.width || defaultColumnWidth
        })
        return result
    }, [columns])

    const startRowTop = useRef<number>(0)
    const [scrollTop, setScrollTop] = useState<number>(0)
    const [scrollLeft, setScrollLeft] = useState<number>(0)
    const [isScroll, setIsScroll] = useState<boolean>(false)

    const calcCacheRemove = estimatedColumnWidth * cacheRemoveCount

    // 渲染表格的行信息
    const renderRow = useMemo(() => {
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
                    className,
                    style,
                    rows,
                    height,
                    width,
                    columns: sortColumns,
                    estimatedRowHeight,
                    estimatedColumnWidth,
                    headerRowHeight,
                    cacheRemoveCount,
                    defaultColumnWidth,
                    onHeaderCellRender,
                    onEmptyRowsRenderer,
                    onHeaderRowRender,
                    onEditorChange,
                }}
            />
        )

        domRows.push(onHeaderRowRender(headerRow))

        top += headerRowHeight

        rows.some((row, index) => {
            if (top < scrollTop - calcCacheRemove) {
                top += row.height
                return false
            }
            domRows.push(
                <DataGridRow<R>
                    key={row.key}
                    rows={rows}
                    rowIndex={index}
                    width={width}
                    scrollWidth={scrollWidth}
                    scrollLeft={scrollLeft}
                    styled={{
                        height: row.height,
                        top,
                        width: scrollWidth,
                        lineHeight: `${row.height}px`,
                    }}
                    gridProps={{
                        className,
                        style,
                        rows,
                        height,
                        width,
                        columns: sortColumns,
                        estimatedRowHeight,
                        estimatedColumnWidth,
                        headerRowHeight,
                        cacheRemoveCount,
                        defaultColumnWidth,
                        onHeaderCellRender,
                        onEmptyRowsRenderer,
                        onHeaderRowRender,
                        onEditorChange,
                    }}
                />
            )
            top += row.height
            if (top > height + scrollTop + calcCacheRemove) {
                return true
            }
            return false
        })
        return domRows
    }, [
        scrollTop,
        scrollLeft,
        columns,
        estimatedColumnWidth,
        width,
        cacheRemoveCount,
        headerRowHeight,
        rows,
        estimatedRowHeight,
    ])

    const lastScrollTop = useRef<number>(0)
    const lastScrollLeft = useRef<number>(0)

    const timeout = useRef<ReturnType<typeof setTimeout>>();

    const onScroll = ({
        currentTarget,
    }: React.UIEvent<HTMLDivElement, UIEvent>) => {
      
        if (timeout.current) {
            clearTimeout(timeout.current)
        } else if (isScroll === false){
            setIsScroll(true)
        }

        timeout.current = setTimeout(() => {
            setIsScroll(false)
            timeout.current = undefined
        }, 400);

        const { scrollTop: currentScrollTop, scrollLeft: currentScrollLeft } =
            currentTarget
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

    return (
        <Context.Provider
            value={{
                state,
                dispatch,
            }}
        >
            <Grid
                ref={gridRef}
                className={className}
                style={{
                    height,
                    width,
                    ...style
                }}
                onScroll={onScroll}
            >
                <div
                    style={{
                        height: scrollHeight,
                        pointerEvents: isScroll ? 'none' : undefined
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
        </Context.Provider>
    )
}

export default DataGrid
