// 还可以直接将 createSetter 和 createGetter 分层出去到baseHandlers.ts
import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers, shallowReactiveHandlers } from './baseHandlers'

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

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandlers)
}

export function shallowReactive(raw) {
    return createActiveObject(raw, shallowReactiveHandlers)
}

// 判断是否是Reactive
export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

// 判断是否是Readonly
export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

// 判断是否是Proxy
export function isProxy(value) {
    return isReactive(value) || isReadonly(value)
}

