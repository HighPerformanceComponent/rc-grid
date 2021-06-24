import { ReactNode } from 'react'

export interface Row {
    key: string
    /** 表格行的高度 */
    height: number
    /** 表格的单元格信息 */
    cells: Array<Cell>
}

export interface Cell {
    name: string
    value: string
    colSpan?: number
    rowSpan?: number
}

export interface Column<TRow> {
    /** 列数据在数据项中对应的路径 */
    name: string
    /** 列头显示文字 */
    title: string | ((row: TRow) => ReactNode)
    /** 列宽度 */
    width?: number
    /** 对其方式 */
    align?: 'left' | 'right' | 'center'
    /** 固定列 */
    fixed?: 'left' | 'right'
}
