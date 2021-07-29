import { isInvisibleScrollbar } from '../../src/utils/browser'

test('isInvisibleScrollbar test', () => {
    expect(isInvisibleScrollbar()).toMatchSnapshot()
})