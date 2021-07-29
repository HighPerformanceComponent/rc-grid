const ResizeObserverMock = jest.fn((callback: Function) => {
    callback()
    return ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    })
});

export default ResizeObserverMock