import { track, trigger } from "./effect";

const get = createGetter()
const readonlyGet = createGetter(true)
const set = createSetter()

function createGetter (isReadonly = false) {
    return (target, key, receiver) =>  {
        const res = Reflect.get(target, key, receiver)
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
    readonlyGet,
    // 只读不收集依赖 所以不用执行
    set(target, key, receiver) {
        return true
    },
}

