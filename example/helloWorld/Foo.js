import { h } from '../../lib/guide-mini-vue.esm.js'
/**
 * props实现
 * 1.props可以通过this访问
 * 2.props不能被修改
 */
export const foo =  {
    render() {
        window.self = this
        return h('div', {}, 'foo:' + this.count)
    },
    setup(props) {
        console.log(props)
    }
}
