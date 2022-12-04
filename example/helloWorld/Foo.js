import { h, renderSlot, getCurrentInstance, provide, inject, createTextVNode } from '../../lib/guide-mini-vue.esm.js'
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
 * 实现provide inject
 */
 const injectCom1 =  {
    name: 'injectCom',
    setup() {
        const injectVal = inject('foo')
        return {
            injectVal
        }
    },
    render() {
        return h('div', {}, this.injectVal)
    },
}

const injectCom =  {
    name: 'injectCom',
    setup() {
        provide('foo', 'provide:injectCom')
        const injectVal = inject('foo')
        return {
            injectVal
        }
    },
    render() {
        return h('div', {}, [h(injectCom1), createTextVNode(this.injectVal)])
    },
}




export const foo =  {
    name: 'foo',
    setup(props, { emit }) {
        console.log(props)
        const currentInstance = getCurrentInstance()
        console.log('currentInstance:', currentInstance)
        const addClick = () => {
            console.log('addClick')
            emit('click', '参数1')
            emit('add-click', '参数2')
        }
        provide('foo', 'provide:foo')
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
        return h('div', {}, [renderSlot(this.$slot, 'slot2', {age}), foo, but, h(injectCom), renderSlot(this.$slot, 'slot1', {age})])
    },
}
