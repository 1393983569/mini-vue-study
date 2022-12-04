import { h, createTextVNode, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'
import { foo } from './Foo.js'
window.self = null
export default {
    name: 'App',
    render() {
        window.self = this
        return h(
            'div',
            {
                // id: 'root',
                // class: ['red', 'hard'],
                // onClick: () => console.log('1111111111')
            },
            [h('p', { class: 'blue' }, 'hello'), h(foo, {
                count: 'props',
                onClick: (e) => console.log(e, 'onClick'),
                onAddClick: (e) => console.log(e, 'onAddClick'),
             }, {
                slot1: ({age}) => h('p', { class: 'blue' }, 'slot1' + age), 
                slot2: ({age}) => h('p', { class: 'blue' }, 'slot2'+ age)
             }), createTextVNode('做美甲鸭')]
        )
    },
    setup() {
        const currentInstance = getCurrentInstance()
        console.log('currentInstance:', currentInstance)
        return {
            msg: '去上班'
        }
    }
}
