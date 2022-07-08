// effect.spec.ts
import { reactive } from "../reactive";
import { effect } from "../effect";

describe("effect", () => {
    it("happy path", () => {
        const obj = reactive({
            age: 18,
        });
        let nextAge;
        effect(() => {
            nextAge = obj.age + 1;
        });
        // 传递给effect函数的参数会被执行。
        expect(nextAge).toBe(19);
        // 当响应式对象发生变化时
        obj.age++;
        // 会重新执行传递给effect函数的参数
        expect(nextAge).toBe(20);
    });
});