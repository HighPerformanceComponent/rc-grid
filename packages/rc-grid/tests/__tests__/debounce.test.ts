import debounce from '../../src/utils/debounce'

test('test debounce 3 click',async () => {
    const mockCallBack = jest.fn();
    const newFn = debounce(mockCallBack, 500, { maxTime: 500})
    newFn()
    newFn()
    newFn()
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, 600);
    })

    expect(mockCallBack.mock.calls.length).toEqual(2);
})

test('test debounce 2 click delay 500ms',async () => {
    const mockCallBack = jest.fn();
    const newFn = debounce(mockCallBack, 500, { maxTime: 500})
    newFn()
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve()
        }, 600);
    })
    newFn()
    expect(mockCallBack.mock.calls.length).toEqual(2);
})