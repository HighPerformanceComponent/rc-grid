import ResizeObserverMock from './__mocks__/ResizeObserver.mock'


/** polyfill ResizeObserver */
global.ResizeObserver = ResizeObserverMock


/** polyfill scrollTo */
Element.prototype.scrollTo = () => {} 