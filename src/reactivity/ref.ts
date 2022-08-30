
import { trackEffects, triggerEffects, isTracking } from './effect'

class RefImpl {
    private _value
    public dep
    constructor(value) {
        // 处理值为对象的逻辑
        this._value = value
        this.dep = new Set()
    }

    get value() {
        trackRefValue(this)
        return  this._value
    } 

    set value(newVal) {
        // 使用Object.is()不去使用===是应为会更加严谨，比如 +0 -0 在 ‘===’是相等 Object.is()就不会
        // 判断更新的值是否和现在的值相等，如果相等就不去更新值
        if (Object.is(newVal, this._value)) return
        this._value = newVal
        triggerEffects(this.dep)
    }
}

// 单独抽离出来做下优化
function trackRefValue(ref) {
    // isTracking如果没有被effect过就不执行收集依赖的动作
    if (isTracking()) {
        trackEffects(ref.dep)
    }
}

function ref(value) {
    return new RefImpl(value)
}

