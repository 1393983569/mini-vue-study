import { h } from '../../lib/guide-mini-vue.esm.js'
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
            // 'hi,' + this.msg
            [h('p', { class: 'blue' }, 'hello'), h('a', { class: 'blue' }, '去上班')]
        )
    },
    setup() {
        return {
            msg: '去上班'
        }
    }
}
