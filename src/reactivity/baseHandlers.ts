import { track, trigger } from "./effect";
import { isObject, extend } from '../shared'
import {
    reactive, 
    readonly,
    ReactiveFlags
} from './reactive'

const get = createGetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
const shallowReactiveGet = createGetter(false, true)
const set = createSetter()

function createGetter (isReadonly = false, shallow = false) {
    // receiver 当前proxy
    return (target, key, receiver) =>  {
        // 用于判断是否是reactive
        if (key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly
        // 用于判断是否是readonly
        } else if (key === ReactiveFlags.IS_READONLY) {
            return isReadonly
        }
        /**
         * 使用Reflect主要是为了避免代理陷阱 触发代理对象的劫持时保证正确的 this 上下文指向
         * Reflect.get()方法用于允许用户从对象获取函数的属性
         * target:它是获取属性的目标对象。
         * propertyKey: 就是要获取的key的名字。
         * receiver: 如果遇到 getter，它是为对象调用提供的 this 值。
         */
        const res = Reflect.get(target, key, receiver)
        if (shallow) {
            return res
        }
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

// 单独抽离出get 和 set 方法
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

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
})

export const shallowReactiveHandlers = extend({}, readonlyHandlers, {
    get: shallowReactiveGet
})

