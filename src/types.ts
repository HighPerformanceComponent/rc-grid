import { CSSProperties, ReactNode } from 'react'

export interface Row {
    key: string
    /** 表格行的高度 */
    height: number
    /** 表格的单元格信息 */
    cells: Array<Cell>
}

export interface CellStyle
    extends Omit<
        CSSProperties,
        'left' | 'zIndex' | 'width' | 'height' | 'position' | 'display'
    > {}

export interface Cell {
    /** 对应 Column 的 name 属性 */
    name: string
    /** 实际显示的值信息 */
    value: string
    /** 任何 JSON 数据 */
    object?: any
    /** 合并列的数量 */
    colSpan?: number
    /** 合并行的数量 */
    rowSpan?: number
    /** css 样式 */
    style?: CellStyle
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
