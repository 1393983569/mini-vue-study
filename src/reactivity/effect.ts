// 存储依赖的weakMap
const targetMap = new WeakMap();
// 保存当前执行的函数（dep）
let activeEffect: any = null
// 处理effect dep的类
class ReactiveEffect {
    private _fn: any
    constructor(fn, public scheduler?) {
        // 初始化赋值当前执行函数
        this._fn = fn
    }
    // 触发函数执行
    run() {
        activeEffect = this
        return this._fn()
    }
}

// 初始化时就会执行一次
export function effect(fn, options:any = {}) {
    // 实例化
    const _effect = new ReactiveEffect(fn, options.scheduler)
    // 触发run执行当前收集函数
    _effect.run()
    // 这里使用bind指定this，不然直接return出去会使this指向window
    return _effect.run.bind(_effect)
}

// 依赖收集
export function track(target, key) {

    let depMpa = targetMap.get(target)
    if (!depMpa) {
        depMpa = new Map()
        targetMap.set(target, depMpa)
    }

    let dep = depMpa.get(key)
    if (!dep) {
        dep = new Set()
        depMpa.set(key, dep)
    }

    if (activeEffect) {
        dep.add(activeEffect)
    }

}

// 触发更新
export function trigger(target, key) {
    // 按照当前触发更新的对象取出depsMap 比如 {fo:要执行的函数}
    const depsMap = targetMap.get(target)
    // 按照key取出dep
    const deps = depsMap.get(key)
    if (!deps) return 
    // 循环执行
    for (let effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}
