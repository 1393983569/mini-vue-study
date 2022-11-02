import { createComponentInstance, setupComponent } from './component'
import { ShapeFlags } from '../shared/shapeFlags'

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
    if (ShapeFlags.ELEMENT & vnode.shapeFlags) {
        processElement(vnode, container)
    } else {
        processComponent(vnode, container);
    }
}

function processElement(vnode: any, container: any) {
    // 这里分为初始化（mount）和更新（update）
    mountElement(vnode, container)
}

// 处理element类型
function mountElement(vnode: any, container: any) {
    // vonde => element => div
    const el = (vnode.el = document.createElement(vnode.type))
    const { shapeFlags } = vnode
    // 判断当前children是否是一个字符串
    if (ShapeFlags.TEXT_CHILDREN & shapeFlags) {
        el.textContent = vnode.children
    // 判断当前children是否是一个数组  例:[h('p', {class: 'blue'}, 'hello'), h('a', {class: 'blue'}, '去美甲')]
    } else if(ShapeFlags.ARRAY_CHILDREN & shapeFlags) {
        mountChildren(vnode, el)
    }
    const { props } = vnode
    // 处理props属性
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
function mountComponent(initialVNode, container) {
    // 通过 vnode 获取组件实例
    const instance = createComponentInstance(initialVNode)
    // setup component
    // 初始化props 初始化slots 调用setupStatefulComponent处理 setup 的返回值
    setupComponent(instance)
    // setupRenderEffect
    setupRenderEffect(instance, initialVNode, container)
}

/**
 * 
 * @param instance 组件实例
 * @param vnode component的虚拟节点
 * @param container 
 */
function setupRenderEffect(instance, initialVNode, container) {
    // setup的代理 用于获取setup里的值,比如组件里的<div>{{this.msg}}</div>
    const { proxy } = instance
    // 调用 render 和 patch 挂载到 component
    const subTree = instance.render.call(proxy)
    // 下面就是 mountElement 了
    patch(subTree, container)
    // 待mountElement处理完成后就可以获取到div的实例也就是根节点
    initialVNode.el = subTree.el
  }
