import { getCurrentInstance } from './component'

export function provide(key, val) {
    const currentInstance:any = getCurrentInstance()
    // const { parent } = currentInstance
    if (currentInstance) {
        let { provides } = currentInstance
        const parentProvides = currentInstance.parent.provides
        if (provides === parentProvides) {
            // 利用原型链来存值
            provides = currentInstance.provides = Object.create(parentProvides)
        }
        provides[key] = val
    }
}

export function inject(key: any, defVal: any) {
    const currentInstance:any = getCurrentInstance()
    const parentProvides = currentInstance.parent.provides
    if (currentInstance) {
        if (key in parentProvides) {
            return parentProvides[key]
        } else {
            if (typeof defVal === 'function') {
                return defVal()
            }
            return defVal
        }
    }
}
