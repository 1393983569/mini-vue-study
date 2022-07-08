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
    it("runner", () => {
        // effect函数会返回一个runner函数，该runner函数实际上就是effect实例的run方法
        let foo = 10;
        const runner: any = effect(() => {
          foo++;
          return "foo";
        });
        expect(foo).toBe(11);
    
        const r = runner();
    
        expect(r).toBe("foo");
        expect(foo).toBe(12);
      });
});

