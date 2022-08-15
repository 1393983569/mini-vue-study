import { track, trigger } from "./effect";
import { isObject } from '../shared'
import {
    reactive, 
    readonly,
    ReactiveFlags
} from './reactive'

const get = createGetter()
const readonlyGet = createGetter(true)
const set = createSetter()

function createGetter (isReadonly = false) {
    return (target, key, receiver) =>  {
        // 用于判断是否是Readonly
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        const res = Reflect.get(target, key, receiver)
        // 判断是否嵌套
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }

        // isReadonly 判断是否只读
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

// 使用高阶函数
function createSetter () {
    return (target, key, receiver) => {
        const res = Reflect.set(target, key, receiver)
        trigger(target, key)
        return res
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandlers = {
    get: readonlyGet,
    // 只读不需要收集依赖 所以不用执行
    set(target, key, value) {
        // 在这里警告
        console.warn(
            `key: ${key} set value: ${value} fail, because the target is readonly`,
            target
        )
        return true
    }
}

