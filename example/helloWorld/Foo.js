import { h, renderSlot } from '../../lib/guide-mini-vue.esm.js'
/**
 * props实现
 * 1.props可以通过this访问
 * 2.props不能被修改
 * 实现emit
 * 触发指定事件
 * 可携带参数
 * slot实现
 * 1.基础slot功能
 * 2.支持多个
 * 3.具名插槽
 * 4.作用域插槽
 */
export const foo =  {
    setup(props, { emit }) {
        console.log(props)
        const addClick = () => {
            console.log('addClick')
            emit('click', '参数1')
            emit('add-click', '参数2')
        }
        return {
            addClick
        }
    },
    render() {
        const age = 18
        const foo = h('p', {}, 'foo:' + this.count)
        const but = h('div', {
            onClick: this.addClick
        }, 'addClick')
        return h('div', {}, [renderSlot(this.$slot, 'slot2', {age}), foo, but, renderSlot(this.$slot, 'slot1', {age})])
    },
}
