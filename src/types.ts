import { ComponentType, CSSProperties, HTMLAttributes, ReactNode } from 'react'

type SharedDivProps = Pick<
    HTMLAttributes<HTMLDivElement>,
    'className' | 'style'
>

type SortDirection = 'ASC' | 'DESC'

export interface SortColumn {
    readonly columnKey: string
    readonly direction: SortDirection
}

export interface DataGridProps<R> extends SharedDivProps {
    /** 表格的行数据信息 */
    rows: readonly Row<R>[]
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
    /** 用户编辑触发的数据 */
    onEditorChangeSave?: (change: EditorChange<R>) => void
    /** 渲染表格头部的单元格 */
    onHeaderCellRender?: (param: HeaderCellRenderParam<R>) => ReactNode[]
    /** 渲染表格的头部的行信息 */
    onHeaderRowRender?: (node: JSX.Element) => ReactNode
    /** 表格列头部改变宽度触发的事件 */
    onHeaderResizable?: (column: Column<R>[]) => void
    /** 数据空的时候渲染对应的数据信息 */
    onEmptyRowsRenderer?: () => ReactNode
    /** 表格执行排序的时候触发的方法 */
    onSort?: (sortColumn: SortColumn[]) => void
}

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
    row: Row<R>
    /** 改变的字段信息 */
    changeValue: R
}

export type EditorValue = number | string | boolean

export interface EditorProps {
    style: CSSProperties
    /** 当前编辑框的值 */
    value: EditorValue
    /** 当内容编辑完成后触发的事件 */
    onEditCompleted: (value: EditorValue) => void
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
    /** 当前列是否只读 */
    readonly readonly?: boolean | ((row: Row<TRow>) => boolean)
    /** 是否支持排序 */
    readonly sort?: boolean
    /** 列是否可以拖拽改变大小 */
    readonly resizable?: boolean
    /** 表格的编辑按钮 */
    readonly editor?: ComponentType<EditorProps> | null
}

export interface HeaderCellRenderParam<R> {
    column: Column<R>
    index: number
    headerCell: JSX.Element
}
