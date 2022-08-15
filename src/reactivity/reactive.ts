// 还可以直接将 createSetter 和 createGetter 分层出去到baseHandlers.ts
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly',
}

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

// 判断是否是Reactive
export function isReactive(value) {
    console.log(value[ReactiveFlags.IS_REACTIVE])
    return !!value[ReactiveFlags.IS_REACTIVE]
}

// 判断是否是Readonly
export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

