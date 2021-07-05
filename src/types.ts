import { ComponentType, CSSProperties, ReactNode } from 'react'

export interface Row<T> {
    key: string
    /** 表格行的高度 */
    height: number
    /** 表格的单元格信息 */
    cells: Array<Cell>
    /** 任何 JSON 数据 */
    object?: T
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
    /** 合并列的数量 */
    colSpan?: number
    /** 合并行的数量 */
    rowSpan?: number
    /** 禁用选中 */
    disableSelect?: boolean
    /** css 样式 */
    style?: CellStyle
}

export interface EditorChange<R> {
    /** 当前行的数据 */
    row: R
    /** 改变的字段信息 */
    changeValue: R
}

export type EditorValue = number | string | boolean

export interface EditorProps {
    style: CSSProperties
    /** 当前编辑框的值 */
    value: EditorValue
    /** 当前改变内容触发的信息 */
    onChange: (value: EditorValue) => void
    /** 当内容编辑完成后触发的事件 */
    onEditCompleted: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Column<TRow> {
    /** 列数据在数据项中对应的路径 */
    readonly name: string
    /** 列头显示文字 */
    readonly title: ReactNode
    /** 列宽度 */
    readonly width?: number
    /** 对其方式 */
    readonly align?: 'left' | 'right' | 'center'
    /** 固定列 */
    readonly fixed?: 'left' | 'right'
    /** 表格的编辑按钮 */
    readonly editor?: ComponentType<EditorProps> | null
}

export interface HeaderCellRenderParam<R> {
    column: Column<R>
    index: number
    headerCell: JSX.Element
}
