import { extend } from '../shared' 

// 存储依赖的weakMap
const targetMap = new WeakMap();
// 保存当前执行的函数（dep）
let activeEffect: any = null
// 是否可以收集依赖
let shouldTrack: boolean = false
// 处理effect dep的类
class ReactiveEffect {
    private _fn: any
    deps: any = []
    onStop?: () => void
    // 防止重复触发stop
    active:boolean = true
    constructor(fn, public scheduler?) {
        // 初始化赋值当前执行函数
        this._fn = fn
    }
    // 触发函数执行
    run() {
        // 当前如果是stop的状态
        if (!this.active) {
            return this._fn()
        }
        // 如果不是stop的状态 就置为可以收集依赖的状态
        shouldTrack = true
        activeEffect = this
        const result = this._fn()
        // 收集完依赖后再重置回不可收集的状态
        shouldTrack = false
        return result
    }
    stop() {
        if (this.active) {
            cleanupEffect(this)
            if (this.onStop) this.onStop()
            this.active = false
        }
    }
}

function cleanupEffect (effect) {
    effect.deps.forEach(dep => {
        dep.delete(effect)
    })
    effect.deps.length = 0
}

export function stop (runner) {
    runner.effect.stop()
}

// 初始化时就会执行一次
export function effect(fn, options:any = {}) {
    // 实例化
    const _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)
    // 触发run执行当前收集函数
    _effect.run()
    // 这里使用bind指定this，不然直接return出去会使this指向window
    const runner: any =  _effect.run.bind(_effect)
    runner.effect = _effect
    return runner
}

// 依赖收集
export function track(target, key) {
    if (!isTracking()) return
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
    trackEffects(dep)
}

export function trackEffects(dep) {
    // 如果已经收集就不继续收集
    if (dep.has(activeEffect)) return
    dep.add(activeEffect)
    // 反向收集依赖用于实现stop
    activeEffect.deps.push(dep)
}

// 判断当前是否可以Track
function isTracking () {
    return activeEffect && shouldTrack
}

// 触发更新
export function trigger(target, key) {
    // 按照当前触发更新的对象取出depsMap 比如 {fo:要执行的函数}
    const depsMap = targetMap.get(target)
    // 按照key取出dep
    const deps = depsMap.get(key)
    if (!deps) return 
    triggerEffects(deps)
}
 
export function triggerEffects (deps) {
    // 循环执行依赖
    for (let effect of deps) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}
