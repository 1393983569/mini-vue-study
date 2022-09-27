import { reactive } from "../reactive";
import { watch } from '../watch'

describe('watch', () => {
    it('happy path', () => {
        const scheduler = jest.fn(() => {
            console.log('watch')
        })
        
        const user = reactive({
            age: 1
        })
        watch(() => user, () => scheduler())
        // 当值更新时，会调用 scheduler 方法而不会执行传入的函数
        user.age++
        expect(scheduler).toHaveBeenCalledTimes(1)
       
    })
})