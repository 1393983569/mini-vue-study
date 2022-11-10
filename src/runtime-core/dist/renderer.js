"use strict";
exports.__esModule = true;
exports.render = void 0;
var component_1 = require("./component");
function render(vnode, container) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(vnode, container);
}
exports.render = render;
/**
 *
 * @param vnode 组件实例
 * @param container 根节点
 */
function patch(vnode, container) {
    // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
    // 区分element和component类型 element会返回一个string，component会返回一个对象
    if (1 /* ELEMENT */ & vnode.shapeFlags) {
        processElement(vnode, container);
    }
    else {
        processComponent(vnode, container);
    }
}
function processElement(vnode, container) {
    // 这里分为初始化（mount）和更新（update）
    mountElement(vnode, container);
}
// 处理element类型
function mountElement(vnode, container) {
    // vonde => element => div
    var el = (vnode.el = document.createElement(vnode.type));
    var shapeFlags = vnode.shapeFlags;
    // 判断当前children是否是一个字符串
    if (4 /* TEXT_CHILDREN */ & shapeFlags) {
        el.textContent = vnode.children;
        // 判断当前children是否是一个数组  例:[h('p', {class: 'blue'}, 'hello'), h('a', {class: 'blue'}, '去美甲')]
    }
    else if (8 /* ARRAY_CHILDREN */ & shapeFlags) {
        mountChildren(vnode, el);
    }
    var props = vnode.props;
    // 处理props属性
    for (var key in props) {
        var val = props[key];
        // 判断是否是事件on开头
        var siOn = function (key) { return /^on[A-Z]/.test(key); };
        if (siOn(key)) {
            var event = key.slice(2).toLowerCase();
            // 注册事件
            el.addEventListener(event, val);
        }
        else {
            // 添加属性
            el.setAttribute(key, val);
        }
    }
    container.append(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(function (item) {
        patch(item, container);
    });
}
function processComponent(vnode, container) {
    return mountComponent(vnode, container);
}
/**
 *
 * @param vnode 组件实例
 * @param container 根节点
 */
function mountComponent(initialVNode, container) {
    // 通过 vnode 获取组件实例
    var instance = component_1.createComponentInstance(initialVNode);
    // setup component
    // 初始化props 初始化slots 调用setupStatefulComponent处理 setup 的返回值
    component_1.setupComponent(instance);
    // 执行render
    setupRenderEffect(instance, initialVNode, container);
}
/**
 *
 * @param instance 组件实例
 * @param vnode component的虚拟节点
 * @param container
 */
function setupRenderEffect(instance, initialVNode, container) {
    // setup的代理 用于获取setup里的值,比如组件里的<div>{{this.msg}}</div>
    var proxy = instance.proxy;
    // 调用 render 和 patch 挂载到 component
    var subTree = instance.render.call(proxy);
    // 下面就是 mountElement 了
    patch(subTree, container);
    // 待mountElement处理完成后就可以获取到div的实例也就是根节点
    initialVNode.el = subTree.el;
}
