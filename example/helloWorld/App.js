import { h } from '../../lib/guide-mini-vue.esm.js'
import { foo } from './Foo.js'
window.self = null
export default {
    render() {
        window.self = this
        return h(
            'div',
            {
                id: 'root',
                class: ['red', 'hard'],
                onClick: () => console.log('1111111111')
            },
            [h('p', { class: 'blue' }, 'hello'), h(foo, { count: 'props' })]
        )
    },
    setup() {
        return {
            msg: '去上班'
        }
    }
}
