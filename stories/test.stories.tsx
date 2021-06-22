import React from 'react'

import { Meta } from '@storybook/react'

const Button = () => <div>Button</div>

export default {
    component: Button,
    title: 'Components/Button',
} as Meta

export const Primary: React.VFC<{}> = () => <Button />
