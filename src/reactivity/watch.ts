import { ReactiveEffect } from "./effect";


class WatchRefImpl {
    private _effect: ReactiveEffect;
    private _fn:any
    constructor(getter, fn ?) {
        this._fn = fn
        this._effect = new ReactiveEffect(() => traverse(getter), () => {
            this._fn()
        })
        this._effect.run()
    }

}

export function watch(getter, fn) {
    return new WatchRefImpl(getter, fn)
}

// 递归访问属性 来收集依赖 给每一个属性都挂上activeEffect
function traverse(value, seen = new Set()) {
    if (typeof value !== 'object' || value === null || seen.has(value)) return
    seen.add(value)
    for (const key in value) {
        console.log(value[key])
        traverse(value[key], seen)
    }
    return value
}

