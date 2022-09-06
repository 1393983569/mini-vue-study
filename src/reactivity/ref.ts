
import { isObject, hasChanged } from '../shared'
import { trackEffects, triggerEffects, isTracking } from './effect'
import { reactive } from './reactive'

class RefImpl {
    private _value
    public dep
    private __is_ref
    constructor(value) {
        // 处理值为对象的逻辑
        this._value = convert(value)
        this.dep = new Set()
        // 添加ref标识
        this.__is_ref = true
    }

    get value() {
        trackRefValue(this)
        return  this._value
    }

    set value(newVal) {
        // 判断更新的值是否和现在的值相等，如果相等就不去更新值
        if (hasChanged(newVal, this._value)) return
        this._value = convert(newVal)
        const newDeps = new Set(this.dep)
        triggerEffects(newDeps)
    }
}

// 单独抽离出来做下优化
function trackRefValue(ref) {
    // isTracking如果没有被effect过就不执行收集依赖的动作
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}
 function convert(val) {
    return isObject(val) ? reactive(val) : val
 }

export function ref(value) {
    return new RefImpl(value)
}

export function isRef(ref) {
    return !!ref.__is_ref
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}

