// 还可以直接将 createSetter 和 createGetter 分层出去到baseHandlers.ts
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

// 为了代码的可读性添加一个方法
function createActiveObject(raw, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandlers)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandlers)
}



