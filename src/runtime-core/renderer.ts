import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(vnode, container)
}

/**
 * 
 * @param vnode 组件实例
 * @param container 根节点
 */
function patch(vnode, container) {
    // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
    // 区分element和component类型 element会返回一个string，component会返回一个对象
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else {
        processComponent(vnode, container);
    }
}

function processElement(vnode: any, container: any) {
    // 这里分为初始化（mount）和更新（update）
    mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
    const el = document.createElement(vnode.type)
    
    const { children } = vnode
    if (typeof children === 'string') {
        el.textContent = vnode.children
    } else if(Array.isArray(children)) {
        mountChildren(vnode, el)
    }
    const { props } = vnode
    for (let key in props)  {
        const val = props[key]
        el.setAttribute(key, val)
    }
    container.append(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(item => {
        patch(item, container)
    })
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


