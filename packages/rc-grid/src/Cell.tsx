import React, { CSSProperties, Key, useContext } from 'react'
import styled from 'styled-components'
import Context from './Context'
import { useChevronDownIcon, useChevronRightIcon } from './Icon'
import { Column, DataGridProps, EditorChange, EditorValue, Row } from './types'
import { writeClipboardText } from './utils/browser'

const ExpandableIcon = styled.i`
    width: 16px;
    height: 16px;
    margin-right: 1rem;
    cursor: pointer;
`

function useExpandableRender<T>(
    row: Row<T>,
    isExpandable: (data: Row<T>) => boolean,
    level: number
) {
    const { state, dispatch } = useContext(Context)
    let icon = useChevronRightIcon()
    if (isExpandable?.(row) === false) {
        return null
    }

    const expandable = state.expandableTreeKey.includes(row.key)

    if (expandable) {
        icon = useChevronDownIcon()
    }

    return (
        <ExpandableIcon
            style={{
                margin: `${level}rem`,
            }}
            onClick={() => {
                const newKeys: Key[] = []
                if (expandable) {
                    state.expandableTreeKey.forEach((ele) => {
                        if (ele !== row.key) {
                            newKeys.push(ele)
                        }
                    })
                } else {
                    newKeys.push(...state.expandableTreeKey, row.key)
                }
                dispatch({
                    type: 'setExpandableTreeKey',
                    payload: newKeys,
                })
            }}
        >
            {icon}
        </ExpandableIcon>
    )
}

interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    isSelect: boolean
    readonly: boolean
    styled: CSSProperties
}

const GridCell = styled.div.attrs<GridCellProps>((props) => ({
    style: props.styled,
}))<GridCellProps>`
    display: inline-block;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    outline: none;
    background-color: ${({ readonly }) => {
        if (readonly) {
            return 'hsl(0deg 0% 97%)'
        }
        return 'inherit'
    }};
    user-select: none;
    box-shadow: ${({ isLastFeftFixed, isLastRightFixed, isSelect }) => {
        if (isSelect) {
            return 'inset 0 0 0 2px #66afe9'
        }
        if (isLastFeftFixed) {
            return '2px 0 5px -2px rgb(136 136 136 / 30%)'
        }
        if (isLastRightFixed) {
            return '-3px 0 5px -2px rgb(136 136 136 / 30%)'
        }
        return undefined
    }};
    /** 优化 webkit 中的渲染效率 */
    content-visibility: auto;
    padding: 0px 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    height: 100%;

`

export interface CellProps<T> extends React.HTMLAttributes<HTMLDivElement> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    isSelect: boolean
    styled: CSSProperties
    column: Column<T>
    value: EditorValue
    row: Row<T>
    level: number
    girdProps: DataGridProps<T>
}

function Cell<T>({
    isLastFeftFixed,
    isLastRightFixed,
    isSelect,
    styled: tempStyled,
    onClick,
    column,
    style,
    row,
    value: defaultValue,
    level,
    girdProps: { onEditorChangeSave, expandable },
}: CellProps<T>) {
    const { state, dispatch } = useContext(Context)

    const changeData = state?.editorChange?.find(
        (ele) => ele.row.key === row.key
    )

    let value = defaultValue
    const changeValue = changeData?.changeValue[column.name]
    if (changeData && changeValue) {
        value = changeValue
    }

    let readonly = false

    if (
        (typeof column.readonly === 'function' &&
            column.readonly(row) === true) ||
        column.readonly === true
    ) {
        readonly = true
    }

    const rowKey = row.key
    const colName = column.name

    if (
        column.editor &&
        state.editPosition?.colName === colName &&
        state.editPosition?.rowKey === rowKey &&
        readonly === false
    ) {
        const Editor = column.editor
        return (
            <GridCell
                styled={{
                    ...tempStyled,
                    display: 'inline-flex',
                    padding: 0,
                }}
                readonly={false}
                role="gridcell"
                isLastFeftFixed={isLastFeftFixed}
                isLastRightFixed={isLastRightFixed}
                isSelect={false}
            >
                <Editor
                    style={{
                        flex: 1,
                        width: '100%',
                    }}
                    value={value}
                    onEditCompleted={(newValue) => {
                        dispatch({
                            type: 'setEditPosition',
                            payload: {},
                        })
                        const data: EditorChange<T> = {
                            row,
                            changeValue: ({
                                [column.name]: newValue,
                            } as unknown) as T,
                        }

                        if (changeData) {
                            changeData.changeValue = {
                                ...changeData.changeValue,
                                ...data.changeValue,
                            }
                        } else {
                            state.editorChange.push(data)
                        }

                        dispatch({
                            type: 'setEditorChange',
                            payload: [...state.editorChange],
                        })

                        onEditorChangeSave?.(data)
                    }}
                />
            </GridCell>
        )
    }

    const renderChild = () => {
        if (column.render) {
            return column.render(defaultValue, row)
        }
        return value
    }

    const renderTreeExpandableIcon = () => {
        if (
            expandable?.childrenColumnName === column.name &&
            expandable?.isExpandable?.(row) !== false
        ) {
            return useExpandableRender(row, expandable.isExpandable, level)
        }
        return null
    }

    return (
        <GridCell
            style={style}
            role="gridcell"
            readonly={!(column.editor && readonly === false)}
            styled={tempStyled}
            isLastFeftFixed={isLastFeftFixed}
            isLastRightFixed={isLastRightFixed}
            isSelect={isSelect}
            tabIndex={-2}
            onKeyDown={(e) => {
                const { currentTarget } = e
                if (e.key === 'c' && e.ctrlKey) {
                    writeClipboardText(currentTarget.textContent)
                    currentTarget.style.opacity = '.6'
                    setTimeout(() => {
                        currentTarget.style.removeProperty('opacity')
                        currentTarget.focus()
                    }, 100)
                    e.preventDefault()
                }
            }}
            onClick={(e) => {
                if (isSelect) {
                    dispatch({
                        type: 'setEditPosition',
                        payload: {
                            rowKey,
                            colName,
                        },
                    })
                }
                onClick?.(e)
            }}
        >
            {renderTreeExpandableIcon()}
            {renderChild()}
        </GridCell>
    )
}

export default Cell
