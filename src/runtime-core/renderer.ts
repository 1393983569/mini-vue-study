import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(vnode, container)
}

function patch(vnode, container) {
    // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型  
    // 这里先只处理 component 类型
    processComponent(vnode, container);
}

function processComponent(vnode, container) {
    return mountComponent(vnode, container)
}

/**
 * 
 * @param vnode 组件实例
 * @param container 根节点
 */
function mountComponent(vnode, container) {
    // 通过 vnode 获取组件实例
    const instance = createComponentInstance(vnode)
    // setup component
    // 初始化props 初始化slots 调用setupStatefulComponent处理 setup 的返回值
    setupComponent(instance, container)
    // setupRenderEffect
    setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
    // 调用 render 和 patch 挂载 component
    const subTree = instance.render()
    // 下面就是 mountElement 了
    patch(subTree, container)
  }


