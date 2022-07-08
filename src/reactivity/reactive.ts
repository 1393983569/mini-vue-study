export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver)
            return res
        },
        set(target, key, receiver) {
            const res = Reflect.set(target, key, receiver)
            return res
        }
    })
}