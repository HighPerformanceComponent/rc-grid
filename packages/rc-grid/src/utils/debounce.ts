interface Option {
    // 最大等待时间
    maxTime?: number
}

const debounce = (fn: Function, time: number, option?: Option) => {
    // 最后一次调用的参数
    let lastArgs: any;

    let lastInvokeTime: number;
    let invokeSelf: any;
    
    // 调用的返回信息
    let invokeResult: any;

    let lastCallTime: number = 0
    
    let timeout: any;

    const invokeFunc = () => {
        if (lastArgs) {
            lastCallTime = Date.now()
            const result = fn.apply(invokeSelf, lastArgs)
            invokeResult = result
        }
    }

    const shouldInvoke = (currentTime: number) => {
        const lastInvokeDiff = currentTime - lastInvokeTime
        lastInvokeTime = currentTime

        if (timeout) {
            clearTimeout(timeout)
        }

        if (lastInvokeDiff >= time) {
            return true
        }
        
        if (option?.maxTime && currentTime - lastCallTime > option.maxTime ) {
            return true
        }

        timeout = setTimeout(() => {
            invokeFunc()
        }, time - lastInvokeDiff)

        return false
    }

    function debounced(...args: any[]) {
        invokeSelf = this
        lastArgs = args
        const isInvoking = shouldInvoke(Date.now())
        if (isInvoking) {
            invokeFunc()
        }
        return invokeResult 
    }

    return debounced
}

export default debounce