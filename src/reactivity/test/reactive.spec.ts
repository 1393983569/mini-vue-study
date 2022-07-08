import { reactive } from "../reactive";

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
})


