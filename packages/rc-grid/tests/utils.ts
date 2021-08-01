// eslint-disable-next-line import/prefer-default-export
export const sleep = (time: number) => new Promise<void>((resolve) => {
    setTimeout(() => {
        resolve()
    }, time)
})