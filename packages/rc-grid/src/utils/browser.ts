// from https://github.com/ag-grid/ag-grid/blob/latest/community-modules/core/src/ts/utils/browser.ts

let browserScrollbarWidth: number
let invisibleScrollbar: boolean

function initScrollbarWidthAndVisibility(): void {
    const { body } = document
    const div = document.createElement('div')
    div.style.width = '100px'
    div.style.height = '100px'
    div.style.opacity = '0'
    div.style.overflow = 'scroll'
    ;(div.style as any).msOverflowStyle = 'scrollbar' // needed for WinJS apps
    div.style.position = 'absolute'

    body.appendChild(div)

    let width: number = div.offsetWidth - div.clientWidth

    // if width is 0 and client width is 0, means the DOM isn't ready
    if (width === 0 && div.clientWidth === 0) {
        width = undefined
    }

    // remove div
    if (div.parentNode) {
        div.parentNode.removeChild(div)
    }

    browserScrollbarWidth = width

    invisibleScrollbar = width === 0 || width === undefined
}

export function getScrollbarWidth(): number {
    if (browserScrollbarWidth === undefined) {
        initScrollbarWidthAndVisibility()
    }
    return browserScrollbarWidth
}

export function isInvisibleScrollbar(): boolean {
    if (invisibleScrollbar === undefined) {
        initScrollbarWidthAndVisibility()
    }
    return invisibleScrollbar
}
