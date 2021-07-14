import React, { ReactNode, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
    width: 100%;
    height: 100%;
`

interface AutoSizeProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
    children: (width: number, height: number) => ReactNode
}

const AutoSize = (props: AutoSizeProps) => {
    const { children, ...restProps } = props

    const ref = useRef<HTMLDivElement>(null)

    const [width, setWidth] = useState<number>(0)
    const [height, setHeight] = useState<number>(0)

    useLayoutEffect(() => {
        const observer = new ResizeObserver(() => {
            const rect = ref.current.getBoundingClientRect()
            setWidth(rect.width)
            setHeight(rect.height)
        })
        observer.observe(ref.current)
        return () => {
            observer.unobserve(ref.current)
            observer.disconnect()
        }
    }, [])
    return (
        <Container
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...restProps}
            ref={ref}
        >
            {children(width, height)}
        </Container>
    )
}

export default AutoSize
