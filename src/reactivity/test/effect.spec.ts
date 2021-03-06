// effect.spec.ts
import { reactive } from "../reactive";
import { effect, stop } from "../effect";

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
      it('scheduler', () => {
        let dummy
        let run: any
        // 创建 mock 函数
        const scheduler = jest.fn(() => {
          run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
          () => {
            dummy = obj.foo
          },
          { scheduler }
        )
        // 程序运行时会首先执行传入的函数，而不会调用 scheduler 方法
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // 当值更新时，会调用 scheduler 方法而不会执行传入的函数
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
        // 只有当调用 run 时才会执行传入的函数
        run()
        expect(dummy).toBe(2)
      })
      it("stop", () => {
        let dummy;
        const obj = reactive({ prop: 1 });
        const runner = effect(() => {
          dummy = obj.prop;
        });
        // 执行stop函数前，obj.prop发生变化
        obj.prop = 2;
        // dummy也会对应发生变化
        expect(dummy).toBe(2);
        // 调用stop后
        stop(runner);
        // obj.prop发生变化，dummy不会发生变化了
        obj.prop = 3;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
      })
});

