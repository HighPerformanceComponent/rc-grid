import { isInvisibleScrollbar, writeClipboardText } from '../../src/utils/browser'

test('isInvisibleScrollbar test', () => {
    expect(isInvisibleScrollbar()).toMatchSnapshot()
})

test('writeClipboardText test', async () => {
    writeClipboardText('test 123');
    expect(document.body).toMatchSnapshot()
})