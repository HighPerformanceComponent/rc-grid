import React, { CSSProperties, useState } from 'react'
import styled from 'styled-components'
import { Column, EditorChange, EditorValue, Row } from './types'

interface GridCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    isSelect: boolean
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
    background-color: #fff;
    outline: none;
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
    onEditorChange?: (change: EditorChange<T>) => void
}

function Cell<T>({
    isLastFeftFixed,
    isLastRightFixed,
    isSelect,
    styled: tempStyled,
    onClick,
    onFocus,
    column,
    style,
    row,
    value: defaultValue,
    onEditorChange,
}: CellProps<T>) {
    const [value, setValue] = useState<EditorValue>(defaultValue)
    const [status, setStatus] = useState<'edit' | 'normal'>('normal')

    if (column.editor && status === 'edit') {
        const Editor = column.editor
        return (
            <GridCell
                styled={{
                    ...tempStyled,
                    display: 'inline-flex',
                    padding: 0,
                }}
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
                    onChange={(newValue) => {
                        setValue(newValue)
                    }}
                    onEditCompleted={() => {
                        setStatus('normal')
                        onEditorChange?.({
                            row: row.object,
                            changeValue: {
                                [column.name]: value,
                            } as any,
                        })
                    }}
                />
            </GridCell>
        )
    }

    return (
        <GridCell
            style={style}
            styled={tempStyled}
            isLastFeftFixed={isLastFeftFixed}
            isLastRightFixed={isLastRightFixed}
            isSelect={isSelect}
            onClick={onClick}
            onFocus={onFocus}
            onDoubleClick={() => {
                setStatus('edit')
            }}
        >
            {value}
        </GridCell>
    )
}

export default Cell
