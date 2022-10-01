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
        // 调用stop
        stop(runner);
        // 调用stop后obj.prop发生变化为3，但是因为stop会清空依赖dummy的赋值不会执行所以dummy不会发生变化
        // obj.prop = 3;
        obj.prop++
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
      })
      it('onStop', () => {
        const obj = reactive({
            foo: 1,
        })
        const onStop = jest.fn()
        let dummy
        // onStop 是一个函数，也是 effect 的 option
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            {
                onStop,
            }
        )
        // 在调用 stop 的时候，onStop 也会执行
        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })
    
    // cleanup
    it('cleanup', () => {
      const obj = reactive({
          foo: 1,
          text: 2,
          ok: true,
      })
      let dummy = ''
      let num = 0
      effect(
        () => {
          num++
          dummy = obj.ok ? obj.text : 'not'
        }
      )
      obj.text
      // obj.ok设置为false后 无论obj.text如何改变都不会触发effect执行
      obj.ok = false
      obj.text = 5
      obj.text = 8
      obj.text = 3
      obj.text = 9
      expect(num).toBe(2);
  })
  
  // effect嵌套
  it("happy path", () => {
      const obj = reactive({
          age1: 18,
          age2: 20,
      });
      let temp1, temp2;

      effect(() => {
        console.log('temp1')
        effect(() => {
          console.log('temp2')
          temp1 = obj.age2;
        });
        temp2 = obj.age1;
      });
      // obj.age2 = 22
      obj.age1 = 25
  });
});

