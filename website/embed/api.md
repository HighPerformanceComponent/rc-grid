
# Grid 

|Property          | Description           | Type               | Default
|-----------   |------------------       |---------          |----------
| rows        | Row data information of the table            |`Row<R>[]`         | - 
| columns     | Column information                   | `Column<R>[]`     | -
| height      | Table height                 | `number`           |
| width       | The width of the table                 | `number`           |
| headerRowHeight | The default height of the table header  | `number`           |
| estimatedRowHeight | Estimate the average of the rows of the table  | `number`           |
| estimatedColumnWidth | Estimate the average value of the columns of the table | `number`          |
| cacheRemoveCount     | Number of entries to be removed from the cache | `number`          |
| defaultColumnWidth   | Default column width information     | `number`          |
| expandable           | Expanded configuration information       | `Expandable`      |
| select               | Select component settings                |
| onEditorChangeSave   | User edit triggered data    | `(change: EditorChange<R>) => void` |
| onHeaderCellRender   | Render the cell at the head of the table   | `(param: HeaderCellRenderParam<R>) => ReactNode[]` |
| onHeaderRowRender    | Render the row information of the header of the table | `(node: JSX.Element) => ReactNode` |
| onHeaderResizable    | Event triggered by changing the width of the table column header | `(column: Column<R>[]) => void` |
| onEmptyRowsRenderer  | Render the corresponding data information when the data is empty | `() => ReactNode`|
| onSort               | The method to be triggered when the table is sorted | `(sortColumn: SortColumn[]) => void` |
| onHeaderDrop         | Event triggered by dragging the user header      | `(source: Column<R>, target: Column<R>) => void` |
| onHeaderDragOver     | Allow the current header to be placed       | `(event: DragEvent<HTMLDivElement>) => boolean` 
| onRowClick           | Click event of table row           | `(row: Row<R>) => void`
| onRowDoubleClick     | Double-click event of table row           | `(row: Row<R>) => void`
| onChildrenRows       | Child node information of tree node        | `onChildrenRows?: (row: Row<R>) => readonly Row<R>[]`

## Expandable

|Property          | Description         | Type               | Default
|-----------   |------------------       |---------          |----------
| indentSize   | When displaying tree data, the width of each level of indentation, with rem as the unit | `number` |
| childrenColumnName | Specify the column name of the tree structure  | `string` | 
| isExpandable     | Whether to show expandable buttons  | `(row: Row<R>) => boolean` | 
| expandedRowRender | The actual content of the rendered expansion| `(row: Row<R>, style: CSSProperties) => ReactNode` |

## Column

|Property          | Description         | Type               | Default
|-----------   |------------------       |---------          |----------
| name          | The corresponding path of the column data in the data item   | `string`          |-
| title         | Column header display text               | `ReactNode`       | 
| width         | Column width                    | `number`          | 
| align         | Column alignment                  | `'left'` \| `'right'` \| `'center'`
| fixed         | Fixed column                    | `'left'` \| `'right'` | -
| readonly      | Whether the current column is read-only             | `boolean` \| `((row: Row<TRow>) => boolean)` |
| sort          | Does it support sorting               | `boolean`       | -
| resizable     | Whether the column can be dragged to change the size       | `boolean`       | -
| editor        | Content editor              | `ComponentType<EditorProps>` \| `null` |
| isSelect      | Allow selection                | `(cell: Cell) => boolean` | 
| render        | Custom cell information          | `(text: EditorValue, row: Row<TRow>) => ReactNode`

## Row

|Property          | Description         | Type               | Default
|-----------   |------------------       |---------          |----------
| key          | Unique key            | `string`          |
| height       | Row height              | `number`           |
| cells        | cells information           | `Cell[]`           |
| object       | Bound JSON data           | `T`                 |


## Cell 

|Property          | Description          | Type               | Default
|-----------   |------------------       |---------          |----------
| name         | Corresponding to the name attribute of Column  | `string`          | -
| value        | Display value           | `string`          | -
| colSpan      | merged columns               | `number`          | -
| rowSpan      | Merge rows              | `number`           | -
| style        | css style                | `CellStyle`        | -


## EditorChange 

|Property          | Description          | Type               | Default
|-----------   |------------------       |---------          |----------
| row          | Row data              | `Row<R>`          | -
| changeValue  | Changed field information            | `R`               | -


> For more detailed information, see https://github.com/HighPerformanceComponent/rc-grid/blob/canary/packages/rc-grid/src/types.ts
