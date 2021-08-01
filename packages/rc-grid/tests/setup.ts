import ResizeObserverMock from './__mocks__/ResizeObserver.mock'

/** polyfill ResizeObserver mock */
global.ResizeObserver = ResizeObserverMock

/** polyfill execCommand mock */
global.document.execCommand = () => true;

/** polyfill scrollTo mock */
Element.prototype.scrollTo = () => {} 

