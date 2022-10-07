import { createVNode } from './vnode'
import { render } from './renderer'

// rootComponent就是App
export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 在 vue3 中，会将 rootComponent 转为一个虚拟节点 VNode
            // 后续所有的操作都会基于虚拟节点
            // 这里就调用了一个 createVNode 的 API 将 rootComponent 转换为一个虚拟节点
            // 【注意了】这个虚拟节点就是程序的入口，所有子节点递归处理
            // rootComponent 就是#app
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        }
    }
}