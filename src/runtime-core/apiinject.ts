import { getCurrentInstance } from './component'

export function provide(key, val) {
    const currentInstance:any = getCurrentInstance()
    // const { parent } = currentInstance
    if (currentInstance) {
        let { provides } = currentInstance
        const parentProvides = currentInstance.parent.provides
        provides = currentInstance.provides = Object.create(parentProvides)
        provides[key] = val
    }
}

export function inject(key) {
    const currentInstance:any = getCurrentInstance()
    let val = null
    if (currentInstance) {
        const { parent } = currentInstance
        val = parent.provides[key]
    }
    return val
}
