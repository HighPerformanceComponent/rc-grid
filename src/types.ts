import { ReactNode } from 'react'

export interface Row<R> {
    data: R
    key: string
    height: number
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
