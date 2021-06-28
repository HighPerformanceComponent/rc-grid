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
    cacheRemoveCount = 3,
}: DataGridProps<R>) {
    const [state, dispatch] = useReducer(reducer, {
        scrollLeft: 0,
    })

    const gridRef = useRef<HTMLDivElement>(null)

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
            result += column.width || 120
        })
        return result
    }, [columns])

    const startRowTop = useRef<number>(0)
    const [scrollTop, setScrollTop] = useState<number>(0)

    // 渲染表格的行信息
    const renderRow = useMemo(() => {
        const domRows: Array<ReactNode> = []
        let top = startRowTop.current
        domRows.push(
            <HeaderRow
                key="header"
                columns={columns}
                estimatedColumnWidth={estimatedColumnWidth}
                width={width}
                cacheRemoveCount={cacheRemoveCount}
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
            if (top < scrollTop - estimatedRowHeight * cacheRemoveCount) {
                top += row.height
                return false
            }
            domRows.push(
                <DataGridRow
                    key={row.key}
                    rows={rows}
                    rowIndex={index}
                    columns={columns}
                    estimatedColumnWidth={estimatedColumnWidth}
                    width={width}
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
            if (
                top >
                height + scrollTop + estimatedRowHeight * cacheRemoveCount
            ) {
                return true
            }
            return false
        })
        return domRows
    }, [
        scrollTop,
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

    const ticking = useRef<boolean>(false)

    let requestAnimationFrameId: number

    const calcCacheRemove = estimatedColumnWidth * (cacheRemoveCount / 2)
    const onScroll = ({
        currentTarget,
    }: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (requestAnimationFrameId) {
            cancelAnimationFrame(requestAnimationFrameId)
        }
        if (!ticking.current && currentTarget) {
            requestAnimationFrameId = requestAnimationFrame(() => {
                if (
                    Math.abs(currentTarget.scrollTop - lastScrollTop.current) >
                    calcCacheRemove
                ) {
                    setScrollTop(currentTarget.scrollTop)
                    lastScrollTop.current = currentTarget.scrollTop
                }

                if (
                    Math.abs(
                        currentTarget.scrollLeft - lastScrollLeft.current
                    ) > calcCacheRemove
                ) {
                    dispatch({
                        type: 'setScrollLeft',
                        payload: currentTarget.scrollLeft,
                    })
                    lastScrollLeft.current = currentTarget.scrollLeft
                }
                ticking.current = false
            })

            ticking.current = true
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
