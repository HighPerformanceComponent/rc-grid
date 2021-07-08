import React, { useState } from 'react'
import styled from 'styled-components'

const InputContainer = styled.div`
    position: absolute;
    z-index: 20;
    width: 500px;
    height: 28px;
    left: calc(50% - (500px / 2));
    background-color: #ddd;
    padding: 2px;
    box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014,
        0 9px 28px 8px #0000000d;
    > input {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        border-radius: 2px;
        outline: none;
    }
`

interface UniversalToolbarProps {
    onChange: (value: string) => void
    onBlur: () => void
}

// 表格通用的工具栏
function UniversalToolbar({ onChange, onBlur }: UniversalToolbarProps) {
    const [value, setValue] = useState<string>('')
    return (
        <InputContainer>
            <input
                // eslint-disable-next-line jsx-a11y/no-autofocus
                autoFocus
                value={value}
                onChange={({ target }) => {
                    setValue(target.value)
                }}
                onBlur={() => {
                    onBlur()
                    onChange?.(`${value}`)
                }}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        onChange?.(`${value}`)
                    }
                }}
            />
        </InputContainer>
    )
}

export default UniversalToolbar
