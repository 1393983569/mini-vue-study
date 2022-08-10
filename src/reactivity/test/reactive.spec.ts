import { reactive, readonly, isReactive, isReadonly } from "../reactive";

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
})


