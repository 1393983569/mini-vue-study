import { h } from '../../lib/guide-mini-vue.esm.js'

export default {
    render() {
        return h(
            'div', 
            {
            id: 'root',
            class: ['red', 'hard'],
            },
            // 'hi mini-vue'
            [h('p', {class: 'blue'}, 'hello'), h('a', {class: 'blue'}, '去美甲')]
        )
    },
    setup() {
        return {
            msg: 'mini-vue'
        }
    }
}
