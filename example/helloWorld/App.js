import { h } from '../../lib/guide-mini-vue.esm.js'
import { foo } from './Foo.js'
window.self = null
export default {
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
             })]
        )
    },
    setup() {
        return {
            msg: '去上班'
        }
    }
}
