import React, { CSSProperties, ReactNode } from 'react'
import styled from 'styled-components'

interface GridHeaderCellProps extends React.HTMLAttributes<HTMLDivElement> {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    styled: CSSProperties
}

const GridHeaderCell = styled.div.attrs<GridHeaderCellProps>((props) => ({
    style: props.styled,
}))<GridHeaderCellProps>`
    display: inline-flex;
    position: absolute;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    box-sizing: border-box;
    height: 100%;
    align-items: center;
    background-color: hsl(0deg 0% 97.5%);
    box-shadow: ${({ isLastFeftFixed, isLastRightFixed }) => {
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
`

export interface HeaderCellProps {
    isLastFeftFixed: boolean
    isLastRightFixed: boolean
    styled: CSSProperties
    children: ReactNode
}

function HeaderCell({
    isLastFeftFixed,
    isLastRightFixed,
    styled: tempStyled,
    children,
}: HeaderCellProps) {
    return (
        <GridHeaderCell
            isLastFeftFixed={isLastFeftFixed}
            isLastRightFixed={isLastRightFixed}
            styled={tempStyled}
        >
            {children}
        </GridHeaderCell>
    )
}

export default HeaderCell
