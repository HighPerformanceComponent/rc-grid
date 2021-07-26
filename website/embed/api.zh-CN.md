
# 表格属性

|属性          | 说明                     | 类型               | 默认值
|-----------   |------------------       |---------          |----------
| rows        | 表格的行数据信息            |`Row<R>[]`         | - 
| columns     | 列的信息                   | `Column<R>[]`     | -
| height      | 表格的高度                 | `number`           |
| width       | 表格的宽度                 | `number`           |
| headerRowHeight | 表格 header 的默认高度  | `number`           |
| estimatedRowHeight | 预估表格的行的平均值  | `number`           |
| estimatedColumnWidth | 预估表格的列的平均值 | `number`          |
| cacheRemoveCount     | 缓存要移除的条目数量 | `number`          |
| defaultColumnWidth   | 默认列的宽度信息     | `number`          |
| expandable           | 展开的配置信息       | `Expandable`      |
| select               | 选中的组件设置                |
| onEditorChangeSave   | 用户编辑触发的数据    | `(change: EditorChange<R>) => void` |
| onHeaderCellRender   | 渲染表格头部的单元格   | `(param: HeaderCellRenderParam<R>) => ReactNode[]` |
| onHeaderRowRender    | 渲染表格的头部的行信息 | `(node: JSX.Element) => ReactNode` |
| onHeaderResizable    | 表格列头部改变宽度触发的事件 | `(column: Column<R>[]) => void` |
| onEmptyRowsRenderer  | 数据空的时候渲染对应的数据信息 | `() => ReactNode`|
| onSort               | 表格执行排序的时候触发的方法 | `(sortColumn: SortColumn[]) => void` |
| onHeaderDrop         | 拖拽用户表头触发的事件      | `(source: Column<R>, target: Column<R>) => void` |
| onHeaderDragOver     | 允许当期表头进行放置       | `(event: DragEvent<HTMLDivElement>) => boolean` 
| onRowClick           | 表格行的点击事件           | `(row: Row<R>) => void`
| onRowDoubleClick     | 表格行的双击事件           | `(row: Row<R>) => void`
| onChildrenRows       | 树形节点的子节点信息        | `onChildrenRows?: (row: Row<R>) => readonly Row<R>[]`

## Expandable 可展开属性配置

|属性          | 说明                     | 类型               | 默认值
|-----------   |------------------       |---------          |----------
| indentSize   | 展示树形数据时，每层缩进的宽度，以 rem 为单位 | `number` |
| childrenColumnName | 指定树形结构的列名  | `string` | 
| expandRowByClick   | 通过点击行进行展开 | `boolean` | 
| isExpandable     | 是否显示可展开按钮  | `(row: Row<R>) => boolean` | 
| expandedRowRender | 渲染的展开的实际内容| `(row: Row<R>, style: CSSProperties) => ReactNode` |

## Column 表格列

|属性          | 说明                     | 类型               | 默认值
|-----------   |------------------       |---------          |----------
| name          | 列数据在数据项中对应的路径   | `string`          |-
| title         | 列头显示文字               | `ReactNode`       | 
| width         | 列宽度                    | `number`          | 
| align         | 对其方式                  | `'left'` \| `'right'` \| `'center'`
| fixed         | 固定列                    | `'left'` \| `'right'` | -
| readonly      | 当前列是否只读             | `boolean` \| `((row: Row<TRow>) => boolean)` |
| sort          | 是否支持排序               | `boolean`       | -
| resizable     | 列是否可以拖拽改变大小       | `boolean`       | -
| editor        | 表格的编辑按钮              | `ComponentType<EditorProps>` \| `null` |
| isSelect      | 是否允许选中                | `(cell: Cell) => boolean` | 
| render        | 渲染表格的单元格信息          | `(text: EditorValue, row: Row<TRow>) => ReactNode`

## Row 表格数据行的信息

|属性          | 说明                     | 类型               | 默认值
|-----------   |------------------       |---------          |----------
| key          | 表格的唯一 key            | `string`          |
| height       | 表格行的高度              | `number`           |
| cells        | 表格的单元格信息           | `Cell[]`           |
| object       | 绑定的JSON 数据           | `T`                 |


## Cell 表格数据的单元格

|属性          | 说明                     | 类型               | 默认值
|-----------   |------------------       |---------          |----------
| name         | 对应 Column 的 name 属性  | `string`          | -
| value        | 实际显示的值信息           | `string`          | -
| colSpan      | 合并列的数量               | `number`          | -
| rowSpan      | 合并行的数量              | `number`           | -
| style        | css 样式                 | `CellStyle`        | -


## EditorChange 属性

|属性          | 说明                     | 类型               | 默认值
|-----------   |------------------       |---------          |----------
| row          | 当前行的数据              | `Row<R>`          | -
| changeValue  | 改变的字段信息            | `R`               | -


> 更多详细的信息见 https://github.com/HighPerformanceComponent/rc-grid/blob/canary/packages/rc-grid/src/types.ts