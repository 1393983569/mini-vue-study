"use strict";
exports.__esModule = true;
exports.createVNode = void 0;
function createVNode(type, props, children) {
    // 这里先直接返回一个 VNode 结构，props、children 非必填
    var vnode = {
        type: type,
        props: props,
        children: children,
        el: null,
        shapeFlags: getShapeFlags(type)
    };
    // 根据children判断子类是字符串还是array
    if (typeof children === 'string') {
        vnode.shapeFlags |= 4 /* TEXT_CHILDREN */;
    }
    else if (Array.isArray(children)) {
        vnode.shapeFlags |= 8 /* ARRAY_CHILDREN */;
    }
    return vnode;
}
exports.createVNode = createVNode;
// 判断当前是否是element还是component类型
function getShapeFlags(type) {
    return typeof type === 'string' ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
}
