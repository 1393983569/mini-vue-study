import { reactive, readonly } from "../reactive";

describe('reactive', () => {
    it('happy path', () => {
        const obj = {
            a: 10
        }
        const proxyObj: any = reactive(obj)
        expect(proxyObj).not.toBe(obj)
        proxyObj.a++
        expect(proxyObj.a).toBe(11)
        expect(obj.a).toBe(11)
    })
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
})


