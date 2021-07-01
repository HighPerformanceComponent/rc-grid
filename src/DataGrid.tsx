import React, { ReactNode, useMemo, useReducer, useRef, useState } from 'react'
import styled from 'styled-components'

import type { Row, Column } from './types'
import DataGridRow from './Row'
import HeaderRow from './HeaderRow'
import Context, { reducer } from './Context'

const Grid = styled.div`
    position: relative;
    overflow: auto;
    border: 1px solid #ddd;
    outline: none;
`

type SharedDivProps = Pick<
    React.HTMLAttributes<HTMLDivElement>,
    'className' | 'style'
>

export interface DataGridProps<R> extends SharedDivProps {
    /** 表格的行数据信息 */
    rows: readonly Row[]
    /** 列的信息 */
    columns: readonly Column<R>[]
    /** 表格的高度信息 */
    height?: number
    /** 表格的宽度信息 */
    width?: number
    /** 表格 header 的默认高度 */
    headerRowHeight?: number
    /** 预估表格的行的平均值 */
    estimatedRowHeight?: number
    /** 预估表格的列的平均值 */
    estimatedColumnWidth?: number
    /** 缓存要移除的条目数量 (PS: 值越大，滚动起来越真实不会白屏幕，但是会导致性能变差) */
    cacheRemoveCount?: number
    /** 默认列的宽度信息 */
    defaultColumnWidth?: number
}

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
    cacheRemoveCount = 10,
    defaultColumnWidth = 120,
}: DataGridProps<R>) {
    const [state, dispatch] = useReducer(reducer, {})

    const gridRef = useRef<HTMLDivElement>(null)

    /** 数据进行排序, 方便固定列进行排序 */
    const sortColumns = useMemo(() => {
        const newColumns = [...columns]
        newColumns.sort((before, after) => {
            if (before.fixed === 'left' && after.fixed !== 'left') {
                return -1
            }
            if (after.fixed === 'right' && before.fixed !== 'right') {
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
    const [scrollLeft, setscrollLeft] = useState<number>(0)

    // 计算刷新数据的时机, 在滚动到缓存的 3/4 的时候开始加载数据
    const calcCacheRemove =
        estimatedColumnWidth * cacheRemoveCount -
        (estimatedColumnWidth * cacheRemoveCount) / 4

    // 渲染表格的行信息
    const renderRow = useMemo(() => {
        const domRows: Array<ReactNode> = []
        let top = startRowTop.current
        domRows.push(
            <HeaderRow
                key="header"
                columns={sortColumns}
                estimatedColumnWidth={estimatedColumnWidth}
                width={width}
                cacheRemoveCount={cacheRemoveCount}
                scrollLeft={scrollLeft}
                scrollWidth={scrollWidth}
                defaultColumnWidth={defaultColumnWidth}
                styled={{
                    height: headerRowHeight,
                    top,
                    width: scrollWidth,
                    lineHeight: `${headerRowHeight}px`,
                }}
            />
        )

        top += headerRowHeight

        rows.some((row, index) => {
            if (top < scrollTop - calcCacheRemove) {
                top += row.height
                return false
            }
            domRows.push(
                <DataGridRow
                    key={row.key}
                    rows={rows}
                    rowIndex={index}
                    columns={sortColumns}
                    estimatedColumnWidth={estimatedColumnWidth}
                    width={width}
                    scrollWidth={scrollWidth}
                    scrollLeft={scrollLeft}
                    defaultColumnWidth={defaultColumnWidth}
                    cacheRemoveCount={cacheRemoveCount}
                    styled={{
                        height: row.height,
                        top,
                        width: scrollWidth,
                        lineHeight: `${row.height}px`,
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

    const onScroll = ({
        currentTarget,
    }: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const { scrollTop: currentScrollTop, scrollLeft: currentScrollLeft } =
            currentTarget
        if (currentTarget) {
            if (
                // 纵向： currentScrollTop - lastScrollTop.current 距离上次滚动的距离
                Math.abs(currentScrollTop - lastScrollTop.current) >
                calcCacheRemove
            ) {
                setScrollTop(currentScrollTop)
                lastScrollTop.current = currentTarget.scrollTop
            }

            if (
                // 横向: currentScrollLeft - lastScrollLeft.current 距离上次滚动的距离
                Math.abs(currentScrollLeft - lastScrollLeft.current) >
                calcCacheRemove
            ) {
                setscrollLeft(currentScrollLeft)
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
                tabIndex={0}
                className={className}
                style={{
                    height,
                    width,
                    ...style,
                }}
                onScroll={onScroll}
            >
                <div
                    style={{
                        height: scrollHeight,
                    }}
                >
                    {renderRow}
                </div>
            </Grid>
        </Context.Provider>
    )
}

export default DataGrid
