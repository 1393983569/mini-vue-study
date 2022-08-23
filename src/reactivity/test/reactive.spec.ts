import { reactive, readonly, isReactive, isReadonly, shallowReadonly, isProxy, shallowReactive } from "../reactive";

describe('reactive', () => {
    // it('happy path', () => {
    //     const obj = {
    //         a: 10
    //     }
    //     const proxyObj: any = reactive(obj)
    //     expect(proxyObj).not.toBe(obj)
    //     proxyObj.a++
    //     expect(proxyObj.a).toBe(11)
    //     expect(obj.a).toBe(11)
    // })
    it('happy path', () => {
        // not set
        const original = { foo: 1, bar: 2 }
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(wrapped.bar).toBe(2)
        wrapped.foo = 2
        // set 后不会更改
        expect(wrapped.foo).toBe(1)
    })
    it('should warn when update readonly prop value', () => {
        // 这里使用 jest.fn
        console.warn = jest.fn()
        const readonlyObj = readonly({ foo: 1 })
        readonlyObj.foo = 2
        expect(console.warn).toHaveBeenCalled()
    })
    it('happy path', () => {
        const original = { foo: 1 };
        const observed = reactive(original);
        // 加入 isReactive 判断
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
    })
    it('happy path', () => {
        const original = { foo: 1 };
        const wrapped = readonly(original)
        expect(isReadonly(wrapped)).toBe(true)
        expect(isReadonly(original)).toBe(false)
    })
    it('nested reactive', () => {
        const original = {
            nested: { foo: 1 },
            array: [{ bar: 2 }],
        }
        const observed = reactive(original)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)
    })
    it('happy path', () => {
        const original = { bar: { foo: 1 } }
        // shallow 的意思是浅的，默认 readonly 是嵌套的，而 shallowReadonly 刚好相反
        const shallow = shallowReadonly(original)
        expect(isReadonly(shallow)).toBe(true)
        expect(isReadonly(shallow.bar)).toBe(false)
    })
    it('happy path', () => {
        const original = { bar: { foo: 1 } }
        const notProxy = { bar: { foo: 1 } }
        const observed = reactive(original)
        expect(isProxy(observed)).toBe(true)
        expect(isProxy(notProxy)).toBe(false)
    })
    it('happy path', () => {
        const original = { foo: { bar: 1 } }
        const observed = shallowReactive(original)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(observed.foo)).toBe(false)
    })
})


